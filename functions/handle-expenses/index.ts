import HttpResponse from "@utils/http-response";
import { IAWSRequest } from "@utils/types/aws-request.type";
import { HttpStatus } from "@utils/enums/http-status";
import { ExpensesService } from "@services/expenses";
import { Expense } from "@persistence/models/expense";
import middy from "@middy/core";
import connection from "@persistence/connection";

export async function handler(
  request: IAWSRequest<Omit<Expense, "_id">[], any>
): Promise<Response> {
  try {
    const reqBody: Omit<Expense, "_id">[] = JSON.parse(
      request.aws?.body ?? "{}"
    );

    const expenses = await ExpensesService.manageExpenses(reqBody);

    return new HttpResponse({
      data: expenses,
      status: HttpStatus.CREATED,
    });
  } catch (error: any) {
    return error;
  }
}

export const execute = middy(handler).before(connection);
