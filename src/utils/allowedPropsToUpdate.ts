import { error } from "console";

export const userAllowedProps = {
  profile: {
    allowed: ["name", "phone"],
    error: "Invalid profile update",
    isValid({ data }: { data: string[] }) {
      return data.every((prop) => this.allowed.includes(prop));
    },
  },
  create: {
    allowed: ["name", "phone", "email", "password"],
    error: "Invalid data for signup",
    isValid({ data }: { data: string[] }) {
      return data.every((prop) => this.allowed.includes(prop));
    },
  },
};

export const groupAllowedProps = {
  create: {
    allowed: ["name", "type"],
    error: "Invalid data for group",
    isValid({ data }: { data: string[] }) {
      return data.every((prop) => this.allowed.includes(prop));
    },
  },
};
