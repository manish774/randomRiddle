import { sign } from "jsonwebtoken";
import { model, Schema } from "mongoose";
import { authKey, expiresIn } from "../auth/auth";
import { compare } from "bcrypt";

export interface IUserAuth {
  emailOrPhone: string;
  password: string;
  id: string;
  getJWT: () => string;
  isPasswordSame: (password: string) => boolean;
}

const userAuthSchema = new Schema({
  emailOrPhone: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true },
  id: { type: String, required: true, unique: true },
});

userAuthSchema.methods.getJWT = async function () {
  const user = this as IUserAuth;
  const token = sign({ _id: user.id }, authKey, {
    expiresIn,
  });
  return token;
};

userAuthSchema.methods.isPasswordSame = async function (password: string) {
  const user = this as IUserAuth;
  const matchedPassword = await compare(password, user.password);
  return matchedPassword;
};

const UserAuthModel = model<IUserAuth>("userAuth", userAuthSchema);
UserAuthModel.createIndexes();
export default UserAuthModel;
