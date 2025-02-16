import { NextFunction, Response, Request } from "express";
import { verify } from "jsonwebtoken";
import UserModel from "../models/users";

export const expiresIn = 60 * 60 * 60;
export const authKey = "MANISHKUMAR88@09";
export interface Reqs extends Request {
  user: any;
}

export const auth = async (
  req: Reqs,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const cookie = req.cookies;
    const { token } = cookie;
    if (!token) return res.status(400).json("Invalid token!");
    const userDetail: any = verify(token, authKey);
    const user = await UserModel.findById({ _id: userDetail._id });
    if (!user) res.status(400).json("Invalid request");
    req.user = user;
    next();
  } catch (e) {
    return res.json(e.message);
  }
};

export const getCurrentUserId = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const cookie = req.cookies;
    const { token } = cookie;
    if (!token) return res.status(400).json("Invalid token!");
    const userDetail: any = verify(token, authKey);
    return userDetail._id;
  } catch (e) {
    return res.json(e.message);
  }
};
