import { Router, Request, Response, NextFunction } from "express";
import { groupAllowedProps } from "../utils/allowedPropsToUpdate";
import { componentValidate } from "../utils/validate";
import GroupModel from "../models/group-model";
import { auth, getCurrentUserId } from "../auth/auth";
import UserModel from "../models/users";

const router = Router();

router.post(
  "/create",
  auth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!groupAllowedProps.create.isValid({ data: Object.keys(req.body) })) {
        res.status(400).json(groupAllowedProps.create.error);
      }

      componentValidate({ validateFor: "createGroup", values: req.body });
      const userId = await getCurrentUserId(req, res);
      if (!userId) res.status(400).json("User not valid!");
      const payload = { ...req.body, adminIds: [userId] };
      const group = new GroupModel(payload);
      const response = await group.save();
      res.json(response);
    } catch (e) {
      res.status(400).json(e.message);
    }
  }
);

router.get(
  "/getGroups",
  auth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = await getCurrentUserId(req, res);
      /**
       * Retrieves a list of groups where the specified user is an admin.
       *
       * @param userId - The ID of the user to find groups for.
       * @returns A promise that resolves to an array of groups where the user is an admin.
       */
      const groups = await GroupModel.find({ adminIds: userId });
      if (!groups) res.json("Somthing went wrong");
      res.send(
        groups?.map((x) => ({ _id: x._id, name: x.name, type: x.type }))
      );
    } catch (e) {
      res.status(400).json(e.message);
    }
  }
);

router.get(
  "/groupMembers/:groupId",
  auth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = await getCurrentUserId(req, res);
      const { groupId } = req.params;
      if (!groupId) res.status(400).json("No valid group");
      const groupInfo = await GroupModel.findOne({ _id: groupId });
      if (!groupInfo?.adminIds.includes(userId))
        res.status(400).json("User is not part of this group");

      const members = await UserModel.find({
        _id: { $in: groupInfo?.adminIds },
      });
      res.json(members);
    } catch (e) {
      res.status(400).json(e.message);
    }
  }
);

router.patch(
  "/addMemberInGroup",
  auth,
  async (req: Request, res: Response, next: NextFunction) => {
    //for adding any memeber to a group
    try {
      const userId = await getCurrentUserId(req, res);
      const { groupId } = req.body;
      if (!groupId) res.status(400).json("No valid group");

      const groupInfo = await GroupModel.findOne({ _id: groupId });
      if (!groupInfo) res.status(400).json("No group is there");
      if (!groupInfo?.adminIds.includes(userId)) {
        const response = await GroupModel.updateOne(
          { _id: groupId },
          { adminIds: [...groupInfo?.adminIds, userId] }
        );
        res.json(response);
      } else {
        res.json("User already part of this group");
      }
    } catch (e) {
      res.status(400).json(e?.message);
    }
  }
);
export default router;
