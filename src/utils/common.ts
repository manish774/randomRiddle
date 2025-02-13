export type GroupTypes = "PUBLIC" | "PRIVATE";

export enum GroupName {
  PUBLIC = "PUBLIC",
  PRIVATE = "PRIVATE",
}

export type IStatus = "ENABLE" | "DISABLE";

export enum IStatusName {
  ENABLE = "ENABLE",
  DISABLE = "DISABLE",
}

export type IActivness = "ACTIVE" | "INACTIVE";

export enum IActivnessName {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export const getFormattedTimestamp = (date: Date) => {
  const isoString = date.toISOString();
  const offsetMinutes = date.getTimezoneOffset();
  const offsetHours = Math.abs(Math.floor(offsetMinutes / 60));
  const offsetMins = Math.abs(offsetMinutes % 60);
  const sign = offsetMinutes > 0 ? "-" : "+";

  // Format the offset as "+HH:MM" or "-HH:MM"
  const offsetFormatted = `${sign}${String(offsetHours).padStart(
    2,
    "0"
  )}:${String(offsetMins).padStart(2, "0")}`;

  // Replace 'Z' with the formatted timezone offset
  return isoString.replace("Z", offsetFormatted);
};
