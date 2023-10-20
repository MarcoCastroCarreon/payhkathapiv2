import { HttpStatus } from "@utils/enums/http-status";
import mongoose from "mongoose";
import HttpResponse from "@utils/http-response";

export default async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI ?? "");
  } catch (error: any) {
    console.error(`Connection Error: ${error.message}`);
    throw new HttpResponse({
      data: error,
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      headers: {},
    });
  }
};
