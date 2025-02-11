import { Router, Response, Request } from "express";
import { auth as authToken, Reqs } from "../auth/auth";
import { userAllowedProps } from "../utils/allowedPropsToUpdate";
import UserModel from "../models/users";

const router = Router();

router.get("/profile", authToken, async (req: Reqs, res: Response) => {
  try {
    console.log(req.user);
    res.json(req.user);
  } catch (e) {
    res.status(400).json(e);
  }
});

router.patch("/profile/:userId", async (req: Request, res: Response) => {
  try {
    if (!userAllowedProps.profile.isValid({ data: Object.keys(req.body) })) {
      res.status(400).json(userAllowedProps.profile.error);
    }
    const userId = req.params.userId;
    const user = await UserModel.findByIdAndUpdate({ _id: userId }, req.body);
    res.json(user);
  } catch (e) {
    res.status(400).json(e);
  }
});

export default router;
