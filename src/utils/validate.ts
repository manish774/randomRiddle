import { IUser } from "../models/users";
import { IUserAuth } from "../models/userAuth";
import validator from "validator";
import { GroupName } from "./common";

type ISignupValidate = {
  name: string;
  email: string;
  phone: string;
  password: string;
};

export const componentValidate = ({
  validateFor,
  values,
}: {
  validateFor: string;
  values: any;
}) => {
  switch (validateFor) {
    case "signup":
      {
        const { name, email, phone, password } = values;
        if (name.length < 3) {
          throw new Error("Name should have at least 3 characters");
        }
        if (!email) {
          throw new Error("Email is required");
        }
        if (!validator.isEmail(email)) {
          throw new Error("Email is invalid");
        }
        if (!phone) {
          throw new Error("Phone is required");
        }
        if (phone.toString().length !== 10) {
          throw new Error("Phone is invalid");
        }
        if (!password) {
          throw new Error("Password is required");
        }
        if (!validator.isStrongPassword(password)) {
          throw new Error("Password must be strong");
        }
      }
      break;
    case "createGroup": {
      const { name, type } = values;
      if (name.length < 3) {
        throw new Error("Name should have at least 3 characters");
      }
      if (!Object.values(GroupName).includes(type)) {
        throw new Error("Invalid group type");
      }
    }
    default:
      break;
  }
};
