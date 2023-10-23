import { Budget, BudgetModel } from "@persistence/models/budget";
import { HttpStatus } from "@utils/enums/http-status";
import HttpError from "@utils/errors/http-error";
import ServiceError from "@utils/errors/service-error";

export namespace BudgetsService {
    export async function getBudget(id: string): Promise<Budget> {
        try {
            const budget = await BudgetModel.findById(id);

            if(!budget) throw new ServiceError('Budget not found', HttpStatus.NOT_FOUND);

            return budget;
        } catch (error: any) {
            throw new HttpError(error.status, error.message);
        }
    }

    export async function getBudgets(year: number = new Date().getFullYear()): Promise<Budget[]> {
        try {
            const budgets = await BudgetModel.find({ year }).exec();

            return budgets;
        } catch (error: any) {
            throw new HttpError(error.status, error.message);
        }
    }

    
}

