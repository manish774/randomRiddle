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
    case "signup": {
      const { name, email, phone, password } = values;
      if (name.length < 3) {
        throw new Error(
          JSON.stringify({
            field: "name",
            message: "Name should have at least 3 characters",
          })
        );
      }
      if (!email) {
        throw new Error(
          JSON.stringify({ field: "email", message: "Email is required" })
        );
      }
      if (!validator.isEmail(email)) {
        throw new Error(
          JSON.stringify({ field: "email", message: "Email is invalid" })
        );
      }
      if (!phone) {
        throw new Error(
          JSON.stringify({ field: "phone", message: "Phone is required" })
        );
      }
      if (phone.toString().length !== 10) {
        throw new Error(
          JSON.stringify({ field: "phone", message: "Phone is invalid" })
        );
      }
      if (!password) {
        throw new Error(
          JSON.stringify({ field: "password", message: "Password is required" })
        );
      }
      if (!validator.isStrongPassword(password)) {
        throw new Error(
          JSON.stringify({
            field: "password",
            message: "Password must be strong",
          })
        );
      }
      break;
    }
    case "createGroup": {
      const { name, type } = values;
      if (name.length < 3) {
        throw new Error(
          JSON.stringify({
            field: "name",
            message: "Name should have at least 3 characters",
          })
        );
      }
      if (!Object.values(GroupName).includes(type)) {
        throw new Error(
          JSON.stringify({ field: "type", message: "Invalid group type" })
        );
      }
      break;
    }
    default:
      break;
  }
};
