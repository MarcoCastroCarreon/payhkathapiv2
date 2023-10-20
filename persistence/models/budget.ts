import { Schema, model } from "mongoose";

const BudgetSquema: Schema = new Schema({
  date: String,
  budget: String,
  totalPayment: String,
  remaining: String,
  year: String,
});

export default model("Budget", BudgetSquema);
