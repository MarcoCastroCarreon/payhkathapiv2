import { Schema, model, InferSchemaType } from "mongoose";
import { Payment, PaymentSquema } from "./payment";

const BudgetSquema: Schema = new Schema({
  date: String,
  budget: String,
  totalPayment: String,
  remaining: String,
  year: String,
  paymentsList: [PaymentSquema],
  exceeded: String
});

export type BudgetSquema = InferSchemaType<typeof BudgetSquema>;
export type Budget = {
  date: string,
  budget: string,
  totalPayment: string,
  remaining: string,
  year: string,
  paymentsList: Payment[],
  exceeded: string
};
export const BudgetModel = model("Budget", BudgetSquema);
