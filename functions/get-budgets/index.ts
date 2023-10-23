import middy from "@middy/core";
import connection from "@persistence/connection";
import { HttpStatus } from "@utils/enums/http-status";
import HttpResponse from "@utils/http-response";
import { APIGatewayEvent } from "aws-lambda";
import { BudgetsService } from "@services/budgets";

async function handler(request: APIGatewayEvent): Promise<Response> {

  const data = await BudgetsService.getBudgets();

  return new HttpResponse({
    data,
    status: HttpStatus.OK,
  });
}

export const execute = middy().handler(handler).before(connection);
