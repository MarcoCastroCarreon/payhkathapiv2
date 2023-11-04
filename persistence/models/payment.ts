import { Schema, model, InferSchemaType } from "mongoose";

enum PaymentType {
  PAYMENT = "payment",
  DOUBT = "DOUBT",
}

export const PaymentSquema: Schema = new Schema({
  name: String,
  payment: String,
  paid: Boolean,
  type: String,
  budgetId: String,
});

export type PaymentSquemaType = InferSchemaType<typeof PaymentSquema>;
export type Payment = {
  name: string;
  payment: string;
  paid: boolean;
  type: PaymentType;
  budgetId: string;
};
export const PaymentModel = model("Payment", PaymentSquema);
