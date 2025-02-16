import { Schema, model } from "mongoose";
import { IActivnessName, IStatus } from "../utils/common";

export interface IQuestions {
  askedBy: string;
  groupId: string;
  question: string;
  dateTime: string;
  status: IStatus;
  isActive: IActivnessName;
}
const questions = new Schema(
  {
    askedBy: { type: Schema.Types.ObjectId, ref: "users", require: true },
    groupId: { type: Schema.Types.ObjectId, ref: "group", require: true },
    question: { type: String, require: true },
    dateTime: { type: String, require: true },
    status: { type: String, require: true },
    isActive: { type: String, require: true },
  },
  { timestamps: true }
);

const QuestionModel = model("questions", questions);
QuestionModel.createIndexes();
export default QuestionModel;
