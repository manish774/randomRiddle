import { Router, Request, Response, NextFunction } from "express";
import QuestionModel from "../models/questions-model";
import { auth, getCurrentUserId } from "../auth/auth";
import {
  getFormattedTimestamp,
  IActivnessName,
  IStatusName,
} from "../utils/common";
import { questionAllowedProps } from "../utils/allowedPropsToUpdate";
import GroupModel from "../models/group-model";

const router = Router();

router.post(
  "/create",
  auth,
  async (req: Request, res: Response): Promise<any> => {
    try {
      const isValid = questionAllowedProps.create.isValid({ data: req.body });
      if (!isValid)
        return res.status(400).json(questionAllowedProps.create.error);

      const userId = await getCurrentUserId(req, res);
      const { question, dateTime, groupId } = req.body;
      const group = await GroupModel.findOne({ _id: groupId });

      if (!group) return res.status(400).json("Invalid group");

      const checkIfQuestion = await QuestionModel.find({
        askedBy: userId,
        dateTime: { $regex: dateTime.split("T")[0] },
        groupId: groupId,
      });

      if (
        dateTime.split("T")[0] === checkIfQuestion[0]?.dateTime?.split("T")[0]
      )
        return res.status(400).json("Can not add more question in same day");

      const payload = new QuestionModel({
        question,
        dateTime,
        groupId,
        askedBy: userId,
        status: IStatusName.ENABLE,
        isActive: IActivnessName.ACTIVE,
      });

      const response = await payload.save();
      res.json(response);
    } catch (e) {
      res.json(e?.message);
    }
  }
);

router.patch(
  "/update",
  auth,
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const { question, dateTime, qid, groupId } = req.body;
      const isValid = questionAllowedProps.update.isValid({
        data: { question, dateTime },
      });
      if (!isValid) {
        res.status(400).json(questionAllowedProps.update.error);
      } else {
        const userId = await getCurrentUserId(req, res);

        const todaDate = dateTime;
        const isQuestionIdSame = await QuestionModel.findOne({
          askedBy: userId,
          _id: qid,
        });

        if (!isQuestionIdSame) return res.status(400).json("Invalid question");
        const checkIfQuestion = await QuestionModel.find({
          askedBy: userId,
          dateTime: { $regex: todaDate.split("T")[0] },
          groupId: groupId,
        });

        if (
          todaDate.split("T")[0] === checkIfQuestion[0]?.dateTime?.split("T")[0]
        )
          return res.status(400).json("Can not add more question in same day");

        const response = await QuestionModel.findByIdAndUpdate(
          { _id: qid },
          { question, dateTime }
        );
        res.json(response);
        //const response = await payload.save();
        // res.json(response);
      }
    } catch (e) {
      res.json(e?.message);
    }
  }
);

router.delete(
  "/delete",
  auth,
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const { id } = req.body;
      const userId = await getCurrentUserId(req, res);

      const gQuestion = await QuestionModel.findOneAndDelete({
        _id: id,
        askedBy: userId,
      });
      if (!gQuestion) return res.status(400).json("Invalid request");
      res.json(gQuestion);
    } catch (e) {
      res.status(400).json(e.message);
    }
  }
);

router.get(
  "/get/:filter",
  auth,
  async (req: Request, res: Response): Promise<any> => {
    try {
      const {
        filter,
      }: { filter?: "ALL" | IActivnessName.ACTIVE | IActivnessName.INACTIVE } =
        req.params;
      const userId = await getCurrentUserId(req, res);
      let resp = null;
      if (filter === "ALL") {
        resp = await QuestionModel.find({ askedBy: userId });
      }
      let query = {};

      if (filter === IActivnessName.ACTIVE) {
        query = { isActive: IActivnessName.ACTIVE };
      } else if (filter === IActivnessName.INACTIVE) {
        query = { isActive: IActivnessName.INACTIVE };
      }

      const questionsList = await QuestionModel.find({
        askedBy: userId,
        ...query,
      });

      res.json(questionsList);
    } catch (e) {
      res.status(400).json();
    }
  }
);

router.get(
  "/getgroup/:filter",
  auth,
  async (req: Request, res: Response): Promise<any> => {
    try {
      const {
        filter,
      }: { filter?: "ALL" | IActivnessName.ACTIVE | IActivnessName.INACTIVE } =
        req.params;
      const groupId = req.query.groupId as string;
      if (!groupId) {
        return res.status(400).json("Missing group id");
      }

      let query: any = { groupId };

      if (filter !== "ALL") {
        if (filter === IActivnessName.ACTIVE) {
          query.isActive = IActivnessName.ACTIVE;
        } else if (filter === IActivnessName.INACTIVE) {
          query.isActive = IActivnessName.INACTIVE;
        }
      }

      const questionsList = await QuestionModel.find(query);
      res.json(questionsList);
    } catch (e) {
      res.status(400).json(e?.message);
    }
  }
);

export default router;
