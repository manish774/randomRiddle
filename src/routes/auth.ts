import { Router, Request, Response } from "express";
import { userAllowedProps } from "../utils/allowedPropsToUpdate";
import { componentValidate } from "../utils/validate";
import UserModel from "../models/users";
import UserAuthModel from "../models/userAuth";
import { hash } from "bcrypt";

const router = Router();

router.post("/signup", async (req: Request, res: Response) => {
  try {
    if (!userAllowedProps.create.isValid({ data: Object.keys(req.body) })) {
      res.status(400).json(userAllowedProps.create.error);
    }
    componentValidate({ validateFor: "signup", values: req.body });
    const hashedPassword = await hash(req.body.password, 10);
    const userInput = req.body;
    const user = new UserModel(userInput);
    const userResp = await user.save();
    const userAuth = new UserAuthModel({
      emailOrPhone: userResp.email,
      password: hashedPassword,
      id: user._id,
    });
    await userAuth
      .save()
      .then(() => {
        res.json(req.body);
      })
      .catch(async (error: any) => {
        await UserModel.findByIdAndDelete(userResp._id);
        res.status(400).send(error);
      });
  } catch (e) {
    res.status(400).json(e?.message);
  }
});

router.post("/login", async (req: Request, res: Response) => {
  try {
    const user = await UserAuthModel.findOne({ emailOrPhone: req.body.email });
    if (user) {
      const validatePassword = await user.isPasswordSame(req.body.password);
      if (validatePassword) {
        const token = await user.getJWT();
        res.cookie("token", token);
        res.json(user?.emailOrPhone);
      } else {
        res.status(400).json("Password is incorrect");
      }
    } else {
      res.status(404).json("User not found");
    }
  } catch (e) {
    res.status(400).json(e?.message);
  }
});

router.post("/logout", async (req: Request, res: Response) => {});

export default router;
