import { Router, Request, Response, NextFunction } from "express";
import AnswersnModel from "../models/answers-model";
import { auth, getCurrentUserId } from "../auth/auth";
import {
  getFormattedTimestamp,
  IActivnessName,
  IStatusName,
} from "../utils/common";
import { answersAllowedProps } from "../utils/allowedPropsToUpdate";
import GroupModel from "../models/group-model";

const router = Router();

router.post(
  "/create",
  auth,
  async (req: Request, res: Response): Promise<any> => {
    try {
      const isValid = answersAllowedProps.create.isValid({ data: req.body });
      if (!isValid)
        return res.status(400).json(answersAllowedProps.create.error);

      const userId = await getCurrentUserId(req, res);
      const { answer, dateTime, groupId } = req.body;
      const todaDate = dateTime;
      const group = await GroupModel.findOne({ _id: groupId });

      if (!group) return res.status(400).json("Invalid group");

      const checkIfQuestion = await AnswersnModel.find({
        answeredBy: userId,
        dateTime: { $regex: todaDate.split("T")[0] },
        groupId: groupId,
      });

      if (
        todaDate.split("T")[0] === checkIfQuestion[0]?.dateTime?.split("T")[0]
      )
        return res.status(400).json("Can not add more answers in same day");

      const payload = new AnswersnModel({
        answer,
        dateTime,
        groupId,
        answeredBy: userId,
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
      const { answer, dateTime, aid, groupId } = req.body;
      const isValid = answersAllowedProps.update.isValid({
        data: { answer, dateTime },
      });
      if (!isValid) {
        return res.status(400).json(answersAllowedProps.update.error);
      } else {
        const userId = await getCurrentUserId(req, res);

        const todaDate = dateTime;
        const isQuestionIdSame = await AnswersnModel.findOne({
          answeredBy: userId,
          _id: aid,
        });

        if (!isQuestionIdSame) return res.status(400).json("Invalid question");
        const checkIfQuestion = await AnswersnModel.find({
          answeredBy: userId,
          dateTime: { $regex: todaDate.split("T")[0] },
          groupId: groupId,
        });

        if (
          todaDate.split("T")[0] === checkIfQuestion[0]?.dateTime?.split("T")[0]
        )
          return res.status(400).json("Can not add more question in same day");

        const response = await AnswersnModel.findByIdAndUpdate(
          { _id: aid },
          { answer, dateTime }
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

      const gQuestion = await AnswersnModel.findOneAndDelete({
        _id: id,
        answeredBy: userId,
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
        resp = await AnswersnModel.find({ answeredBy: userId });
      }
      let query = {};

      if (filter === IActivnessName.ACTIVE) {
        query = { isActive: IActivnessName.ACTIVE };
      } else if (filter === IActivnessName.INACTIVE) {
        query = { isActive: IActivnessName.INACTIVE };
      }

      const questionsList = await AnswersnModel.find({
        answeredBy: userId,
        ...query,
      });

      res.json(questionsList);
    } catch (e) {
      res.status(400).json();
    }
  }
);

export default router;
