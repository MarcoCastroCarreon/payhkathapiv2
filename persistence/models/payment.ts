import { Schema, model, InferSchemaType } from "mongoose";

export enum PaymentType {
  PAYMENT = "PAYMENT",
  DOUBT = "DOUBT",
}

export const PaymentSquema: Schema = new Schema({
  name: String,
  payment: Number,
  paid: Boolean,
  type: String,
  budgetId: String,
});

export type PaymentSquemaType = InferSchemaType<typeof PaymentSquema>;
export type Payment = {
  name: string;
  payment: number;
  paid: boolean;
  type: PaymentType;
  budgetId: string;
};
export const PaymentModel = model("Payment", PaymentSquema);
