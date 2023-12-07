import middy from "@middy/core";
import connection from "@persistence/connection";
import HttpResponse from "@utils/http-response";
import { IAWSRequest } from "@utils/types/aws-request.type";
import { HttpStatus } from "@utils/enums/http-status";
import { Budget } from "@persistence/models/budget";
import { BudgetsService } from "@services/budgets";
import HttpError from "@utils/errors/http-error";
import manageZodError from "@utils/validators/manage-zod-error";
import updateBudgetSchema from "@utils/validators/update-budget-body.schema";

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

    const body: Omit<Budget, "_id"> = JSON.parse(request?.aws?.body ?? "{}");

    const validate = await updateBudgetSchema.spa(body);

    if (!validate.success) {
      return manageZodError(validate.error);
    }

    await BudgetsService.updateBudget(queryParams.budgetId, body);

    return new HttpResponse({
      data: queryParams,
      status: HttpStatus.NO_CONTENT,
    });
  } catch (error: any) {
    return error;
  }
}

export const execute = middy(handler).before(connection);
