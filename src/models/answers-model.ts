import { Schema, model } from "mongoose";
import { IActivnessName, IStatus } from "../utils/common";

export interface IAnswers {
  answeredBy: string;
  groupId: string;
  answer: string;
  dateTime: string;
  status: IStatus;
  isActive: IActivnessName;
}
const answers = new Schema(
  {
    answeredBy: { type: String, require: true },
    groupId: { type: String, require: true },
    answer: { type: String, require: true },
    dateTime: { type: String, require: true },
    status: { type: String, require: true },
    isActive: { type: String, require: true },
  },
  { timestamps: true }
);

const AnswersModel = model("answers", answers);
export default AnswersModel;
