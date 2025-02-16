import { Request, Response, Router } from "express";
import { auth, getCurrentUserId } from "../auth/auth";
import QuestionModel from "../models/questions-model";
import AnswersModel from "../models/answers-model";

const router = Router();

router.post("/start", auth, async (req: Request, res: Response) => {
  const { groupId, dateTime } = req.body;
  const userId = await getCurrentUserId(req, res);
  const commonQuery = {
    dateTime: { $regex: dateTime.split("T")[0] },
    groupId: groupId,
  };
  const [questions, answers] = await Promise.all([
    QuestionModel.find({
      askedBy: userId,
      ...commonQuery,
    }),
    AnswersModel.find({
      answeredBy: userId,
      ...commonQuery,
    }),
  ]);
  res.json({ answers, questions });
});

export default router;
