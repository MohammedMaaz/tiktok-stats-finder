import { errors } from "../constants/error";

export const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export const getSerializedError = (error: any): string => {
  if (!error) return "";

  if (typeof error === "string") return error;
  if (typeof error?.response?.data?.error === "string")
    return error.response.data.error;
  if (typeof error?.message === "string") return error.message;
  if (typeof error?.data === "string") return error.details;

  try {
    const str = JSON.stringify(error);
    return str;
  } catch (e) {}

  return errors.UNKNOWN;
};
