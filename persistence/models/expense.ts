import { Schema, model, InferSchemaType } from "mongoose";

const ExpenseSchema: Schema = new Schema({
  name: String,
  quantity: Number,
  budgetId: String
});

export type ExpenseSchema = InferSchemaType<typeof ExpenseSchema>;
export type Expense = {
    _id?: string;
    name: string;
    quantity: string;
    budgetId: string;
};
export const ExpenseModel = model("Expense", ExpenseSchema);