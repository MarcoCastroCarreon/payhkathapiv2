import HttpResponse from "@utils/http-response";
import { IAWSRequest } from '@utils/types/aws-request.type';
import { HttpStatus } from '@utils/enums/http-status';
import type { Budget } from '@models/budget';
import { BudgetsService } from "@services/budgets";

export async function execute(request: IAWSRequest<Pick<Budget, 'paymentsList'>>): Promise<Response> {
  const reqBody: Pick<Budget, 'budget' | 'paymentsList'> = JSON.parse(request.aws?.body ?? '{}') ;

  const calculatedBudget = BudgetsService.calculate(reqBody);

  return new HttpResponse({
    data: calculatedBudget,
    status: HttpStatus.OK,
  });
}
