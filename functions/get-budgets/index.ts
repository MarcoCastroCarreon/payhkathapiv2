import middy from "@middy/core";
import connection from "@persistence/connection";
import { HttpStatus } from "@utils/enums/http-status";
import HttpResponse from "@utils/http-response";
import { BudgetsService } from "@services/budgets";
import { Budget } from "@persistence/models/budget";
import { IAWSRequest } from "@utils/types/aws-request.type";

async function handler(request: IAWSRequest): Promise<Response> {

  let year

  if(request.aws.queryStringParameters) {
     year = request?.aws?.queryStringParameters?.year ? +request?.aws?.queryStringParameters?.year : new Date().getFullYear();
  }

  const data: Budget[] = await BudgetsService.getBudgets(year);

  return new HttpResponse({
    data,
    status: HttpStatus.OK,
  });
}

export const execute = middy(handler).before(connection);
