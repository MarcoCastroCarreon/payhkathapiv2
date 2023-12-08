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

    export async function manageExpenses(budgetId: string, expenses: Expense[]) {
        try {

            const records = await ExpenseModel.find({ budgetId }).exec();

            const expensesToUpdate = expenses.filter(expense => expense._id);


            const recordsToEliminate: ExpenseSchema[] = [];
            for (const record of records) {
                const founded = expensesToUpdate.find(expense => expense._id == record._id);

                if(!founded) recordsToEliminate.push(record);
            }

            await ExpenseModel.deleteMany({ _id: recordsToEliminate.map(record => record._id)});

            const expensesToCreate = expenses.filter(expense => !expense._id);

            await ExpenseModel.insertMany(expensesToCreate);
            
            for (const expenseToUpdate of expensesToUpdate) {
                const expense = new ExpenseModel(expenseToUpdate);

                await expense.save();
            }

            return {
                created: expensesToCreate,
                updated: expensesToUpdate
            }
        } catch (error: any) {
            throw new HttpError(error.status, error.message);
        }
    }
}