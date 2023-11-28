import middy from "@middy/core";
import connection from "@persistence/connection";
import HttpResponse from "@utils/http-response";
import { IAWSRequest } from "@utils/types/aws-request.type";
import { HttpStatus } from "@utils/enums/http-status";
import { Budget } from "@persistence/models/budget";
import { BudgetsService } from "@services/budgets";
import HttpError from "@utils/errors/http-error";

type UpdateBudgetQueryParams = { budgetId: string };

async function handler(
  request: IAWSRequest<Omit<Budget, "_id">, UpdateBudgetQueryParams>
): Promise<Response> {
  try {
    const queryParams: UpdateBudgetQueryParams =
      request?.aws?.queryStringParameters ?? {};

    if (!queryParams.budgetId) {
      throw new HttpError(
        HttpStatus.BAD_REQUEST,
        "Missing query params budgetId"
      );
    }

    const body: Omit<Budget, '_id'> = JSON.parse(request?.aws?.body ?? "{}");

    await BudgetsService.updateBudget(queryParams.budgetId, body);

    return new HttpResponse({
      data: queryParams,
      status: HttpStatus.NO_CONTENT,
    });
  } catch (error: any) {
    return error;
  }
}

export const execute = middy()
  .handler(handler)
  .before(connection);
