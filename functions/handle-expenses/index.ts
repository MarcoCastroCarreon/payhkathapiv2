import HttpResponse from "@utils/http-response";
import { IAWSRequest } from "@utils/types/aws-request.type";
import { HttpStatus } from "@utils/enums/http-status";
import { ExpensesService } from "@services/expenses";
import { Expense } from "@persistence/models/expense";
import middy from "@middy/core";
import connection from "@persistence/connection";
import HttpError from "@utils/errors/http-error";

export async function handler(
  request: IAWSRequest<Omit<Expense, "_id">[], { budgetId: string }>
): Promise<Response> {
  try {
    const reqBody: Omit<Expense, "_id">[] = JSON.parse(
      request.aws?.body ?? "{}"
    );

    if (request.aws?.queryStringParameters?.budgetId) {
      throw new HttpError(
        HttpStatus.BAD_REQUEST,
        "Budget Id is required in query parameters"
      );
    }

    const { budgetId }: { budgetId: string } =
      request.aws?.queryStringParameters;

    const expenses = await ExpensesService.manageExpenses(budgetId, reqBody);

    return new HttpResponse({
      data: expenses,
      status: HttpStatus.OK,
    });
  } catch (error: any) {
    return error;
  }
}

export const execute = middy(handler).before(connection);
