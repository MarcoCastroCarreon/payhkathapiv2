import { Budget, BudgetModel, BudgetSquema } from "@persistence/models/budget";
import { HttpStatus } from "@utils/enums/http-status";
import HttpError from "@utils/errors/http-error";
import ServiceError from "@utils/errors/service-error";

export namespace BudgetsService {
  export async function getBudget(id: string): Promise<BudgetSquema> {
    try {
      const budget = await BudgetModel.findById(id);

      if (!budget)
        throw new ServiceError("Budget not found", HttpStatus.NOT_FOUND);

      return budget;
    } catch (error: any) {
      throw new HttpError(error.status, error.message);
    }
  }

  export async function getBudgets(
    year: number = new Date().getFullYear()
  ): Promise<BudgetSquema[]> {
    try {
      const budgets = await BudgetModel.find({ year }).exec();

      return budgets;
    } catch (error: any) {
      throw new HttpError(error.status, error.message);
    }
  }

  export async function updateBudget(
    _id: string,
    budget: Omit<Budget, "_id">
  ): Promise<void> {
    try {
      await BudgetModel.findOneAndUpdate({ _id }, budget);
    } catch (error: any) {
      throw new HttpError(error.status, error.message);
    }
  }

  export function calculate({
    budget,
    paymentsList,
  }: Pick<Budget, "budget" | "paymentsList">): Omit<
    Budget,
    "_id" | "year" | "paymentsList" | "date"
  > {
    try {
      const calculatedBudget: Omit<
        Budget,
        "_id" | "year" | "paymentsList" | "date"
      > = {
        budget,
        remaining: "0",
        totalPayment: "0",
        exceeded: "0",
      };

      const totalPayment: number = paymentsList.reduce(
        (prev, current) => prev + +current.payment,
        0
      );

      const result = +budget - totalPayment;

      const remaining: number = result < 0 ? 0 : result;

      const exceeded: number = result < 0 ? result * -1 : 0;

      calculatedBudget.totalPayment = String(totalPayment);
      calculatedBudget.remaining = String(remaining);
      calculatedBudget.exceeded = String(exceeded);

      return calculatedBudget;
    } catch (error: any) {
      throw new HttpError(error.status, error.message);
    }
  }
}
