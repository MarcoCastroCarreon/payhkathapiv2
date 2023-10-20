import { HttpStatus } from "@utils/enums/http-status";
import mongoose from "mongoose";
import HttpResponse from "@utils/http-response";

export default async () => {
  try {
    console.log('Mongo connecting...');
    console.log(process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI as string, { dbName: 'paykath', connectTimeoutMS: 4000 });
    console.log('Mongo Connected!');
  } catch (error: any) {
    console.error(`Connection Error: ${error.message}`);
    throw new HttpResponse({
      data: error,
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      headers: {},
    });
  }
};
