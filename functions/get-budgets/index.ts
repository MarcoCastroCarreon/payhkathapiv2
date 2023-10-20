import middy from "@middy/core";
import connection from "@persistence/connection";
import { HttpStatus } from "@utils/enums/http-status";
import HttpResponse from "@utils/http-response";
import { APIGatewayEvent, Context } from "aws-lambda";

async function handler(
  request: APIGatewayEvent,
  context: Context
): Promise<Response> {
  return new HttpResponse({
    data: { context: context.callbackWaitsForEmptyEventLoop },
    headers: { "Content-Type": "application/json" },
    status: HttpStatus.OK,
  });
}

export const execute = middy().handler(handler).before(connection);
