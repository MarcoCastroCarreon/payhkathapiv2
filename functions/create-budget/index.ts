import middy from "@middy/core";
import connection from "@persistence/connection";
import HttpResponse from "@utils/http-response";
import { IAWSRequest } from "@utils/types/aws-request.type";
import { HttpStatus } from "@utils/enums/http-status";
import { Budget } from "@persistence/models/budget";

async function handler(
  request: IAWSRequest<Omit<Budget, "_id">>
): Promise<Response> {
  const reqBody: Omit<Budget, '_id'> = JSON.parse(request.aws?.body ?? "{}");

  return new HttpResponse({
    data: reqBody,
    status: HttpStatus.CREATED,
  });
}

export const execute = middy(handler).before(connection);
