import { Schema, model } from "mongoose";
import { GroupName } from "../utils/common";

export interface IGroups {
  name: string;
  description?: string;
  type: string;
  adminIds: string[];
}
const groupSchema = new Schema(
  {
    name: { type: String, unique: true, require: true },
    description: { type: String },
    type: { type: String, default: GroupName.PUBLIC, require: true },
    adminIds: { type: Array, default: [] },
  },
  { timestamps: true }
);

const GroupModel = model("group", groupSchema);

export default GroupModel;
