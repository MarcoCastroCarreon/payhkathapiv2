import { Schema, model, InferSchemaType } from "mongoose";

const BudgetSquema: Schema = new Schema({
  date: String,
  budget: String,
  totalPayment: String,
  remaining: String,
  year: String,
});

export type Budget = InferSchemaType<typeof BudgetSquema>;
export const BudgetModel = model("Budget", BudgetSquema);
