import mongoose, { Schema, model } from "mongoose";
import { IActivnessName, IStatus, IStatusName } from "../utils/common";

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
    answeredBy: { type: Schema.Types.ObjectId, ref: "users", require: true },
    groupId: { type: Schema.Types.ObjectId, ref: "group", require: true },
    answer: { type: String, require: true },
    dateTime: { type: String, require: true },
    status: {
      type: String,
      require: true,
      enum: {
        values: [IStatusName.ENABLE, IStatusName.DISABLE],
        message: `{VALUE} is incorrect active`,
      },
    },
    isActive: {
      type: String,
      require: true,
      enum: {
        values: [IActivnessName.ACTIVE, IActivnessName.INACTIVE],
        message: `{VALUE} is incorrect active`,
      },
    },
  },
  { timestamps: true }
);

const AnswersModel = model("answers", answers);
AnswersModel.createIndexes();
export default AnswersModel;
