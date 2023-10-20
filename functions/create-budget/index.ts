import middy from "@middy/core";
import { APIGatewayEvent } from "aws-lambda";
import Budget from "@models/budget";
import connection from "@persistence/connection";
import HttpResponse from "@utils/http-response";

async function handler(request: APIGatewayEvent): Promise<Response> {
  return new HttpResponse({
    data: null,
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export const execute = middy(handler).before(connection);
