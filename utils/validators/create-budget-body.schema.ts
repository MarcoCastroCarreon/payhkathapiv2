import { PaymentType } from "@persistence/models/payment";
import {
  string,
  object,
  number,
  array,
  boolean,
  nativeEnum,
} from "zod";

const PaymentTypeEnum = nativeEnum(PaymentType);

const createBudgetSchema = object({
  date: string({
    invalid_type_error: "date field should be datetime",
    required_error: "Date is required",
  }).min(10, {
    message: "Send a valid date format DD-MM-YYYY",
  }),
  budget: number({
    invalid_type_error: "budget field should be a number",
    required_error: "budget is required",
  }).gte(-1),
  totalPayment: number({
    invalid_type_error: "totalPayment field should be a number",
    required_error: "totalPayment is required",
  }).gte(-1),
  remaining: number({
    invalid_type_error: "remaining field should be a number",
    required_error: "remaining is required",
  }).gte(-1),
  year: number({
    invalid_type_error: "year field should be a number",
    required_error: "year is required",
  }).gte(1970),
  paymentsList: array(
    object({
      name: string().min(1),
      payment: string().min(1),
      paid: boolean().default(false),
      type: PaymentTypeEnum,
      budgetId: string(),
    })
  ),
  exceeded: number({
    invalid_type_error: "exceeded field should be a number",
    required_error: "exceeded is required",
  }).gte(-1),
});

export default createBudgetSchema;
