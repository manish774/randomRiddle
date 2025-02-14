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

export const questionAllowedProps = {
  create: {
    allowed: ["question", "dateTime", "groupId"],
    error: "Invalid data for questions",
    isValid({ data }: { data: Record<string, string> }) {
      return Object.keys(data)?.every((prop) => this.allowed.includes(prop));
    },
  },
  update: {
    allowed: ["question", "dateTime"],
    error: "Invalid data for questions",
    isValid({ data }: { data: Record<string, string> }) {
      return Object.keys(data)?.every((prop) => this.allowed.includes(prop));
    },
  },
};

export const answersAllowedProps = {
  create: {
    allowed: ["answer", "dateTime", "groupId"],
    error: "Invalid data for answer",
    isValid({ data }: { data: Record<string, string> }) {
      return Object.keys(data)?.every((prop) => this.allowed.includes(prop));
    },
  },
  update: {
    allowed: ["answer", "dateTime"],
    error: "Invalid data for answers",
    isValid({ data }: { data: Record<string, string> }) {
      return Object.keys(data)?.every((prop) => this.allowed.includes(prop));
    },
  },
};
