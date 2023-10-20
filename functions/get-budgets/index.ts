import { HttpStatus } from "@utils/enums/http-status";
import HttpResponse from "@utils/http-response";

export default {
  async execute(request: Request): Promise<Response> {
    return new HttpResponse({
      data: request.body,
      headers: { "Content-Type": "application/json" },
      status: HttpStatus.OK,
    });
  },
};
