import { HttpStatus } from "@utils/enums/http-status";
import HttpError from "@utils/errors/http-error";
import { ZodError } from "zod";

export default (error: ZodError) => {
  return new HttpError(
    HttpStatus.BAD_REQUEST,
    error.issues.map((issue) => issue.message).toString()
  );
};
