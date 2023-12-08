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

BudgetSquema.pre('save', function() {
    this.budget = Number(this.budget);
    this.totalPayment = Number(this.totalPayment);
});

export type BudgetSquema = InferSchemaType<typeof BudgetSquema>;
export type Budget = {
  _id?: string,
  date: string,
  budget: Number,
  totalPayment: Number,
  remaining: Number,
  year: Number,
  paymentsList: Payment[],
  exceeded: Number
};
export const BudgetModel = model("Budget", BudgetSquema);
