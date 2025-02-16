import mongoose, { Schema, model } from "mongoose";

export interface IUser {
  name: string;
  email: string;
  phone: number;
}

const usersSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, index: true },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      minlength: 10,
      maxlength: 10,
    },
  },
  { timestamps: true }
);

const UserModel = mongoose.model("users", usersSchema);
UserModel.createIndexes();

export default UserModel;
