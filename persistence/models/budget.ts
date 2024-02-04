import { Schema, model, InferSchemaType } from "mongoose";
import { Payment, PaymentSquema } from "./payment";

const BudgetSquema: Schema = new Schema({
  date: String,
  budget: Number,
  totalPayment: Number,
  remaining: Number,
  year: Number,
  paymentsList: [PaymentSquema],
  exceeded: Number
});

export type BudgetSquema = InferSchemaType<typeof BudgetSquema>;
export type Budget = {
  _id?: string,
  date: string,
  budget: number,
  totalPayment: number,
  remaining: number,
  year: number,
  paymentsList: Payment[],
  exceeded: number
};
export const BudgetModel = model("Budget", BudgetSquema);
