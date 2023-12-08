import { Expense, ExpenseModel, ExpenseSchema } from "@persistence/models/expense";
import HttpError from "@utils/errors/http-error";


export namespace ExpensesService {
    export async function getExpensesByBudgetId(budgetId: string) {
        try {
            const expenses = await ExpenseModel.find({ budgetId }).exec();

            return expenses;
        } catch (error: any) {
            throw new HttpError(error.status, error.message);
        }
    }

    export async function createExpenses(expenses: Omit<Expense, '_id'>[]) {
        try {

            const expensesToBeCreated: ExpenseSchema[] = [];
            for (const expense of expenses) {
                const nExpense = new ExpenseModel(expense);

                expensesToBeCreated.push(nExpense);
            }
            await ExpenseModel.insertMany(expensesToBeCreated);

            return expensesToBeCreated;
        } catch (error: any) {
            throw new HttpError(error.status, error.message);
        }
    }
}