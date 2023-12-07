import middy from "@middy/core";
import connection from "@persistence/connection";
import HttpResponse from "@utils/http-response";
import { IAWSRequest } from "@utils/types/aws-request.type";
import { HttpStatus } from "@utils/enums/http-status";
import { Budget } from "@persistence/models/budget";
import { BudgetsService } from "@services/budgets";
import createBudgetBodySchema from "@utils/validators/create-budget-body.schema";
import manageZodError from "@utils/validators/manage-zod-error";

async function handler(
  request: IAWSRequest<Omit<Budget, "_id">, any>
): Promise<Response> {
  try {
    const reqBody: Omit<Budget, "_id"> = JSON.parse(request.aws?.body ?? "{}");

    const validate = await createBudgetBodySchema.spa(reqBody);

    if (!validate.success) {
      return manageZodError(validate.error);
    }

    const createBudget = await BudgetsService.createBudget(reqBody);

    return new HttpResponse({
      data: createBudget,
      status: HttpStatus.CREATED,
    });
  } catch (error: any) {
    return error;
  }
}

export const execute = middy(handler).before(connection);
