import { HttpStatus } from "@utils/enums/http-status";
import HttpError from "@utils/errors/http-error";
import { ZodError } from "zod";

export default (error: ZodError) => {
  console.log('Zod', error);
  return new HttpError(
    HttpStatus.BAD_REQUEST,
    error.issues.map((issue) => issue.message).toString()
  );
};
