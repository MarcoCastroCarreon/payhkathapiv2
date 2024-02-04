import { string, object, number, array, boolean } from "zod";

const expensesBodySchema = array(
  object({
    _id: string({ invalid_type_error: '_id field should be a string' }),
    name: string({
      required_error: "Name field of the expense is required",
      invalid_type_error: 'Name field should be a string'
    }).min(1),
    quantity: number({ required_error: 'Quantity field of the expense is required', invalid_type_error: 'Quantity field should be a number' }).gte(0, { message: 'Quantity should be greater then 0' }),
    budgetId: string({ required_error: 'Budget Id field of the expense is required', invalid_type_error: 'Budget Id should be a string' }).min(24, { message: 'Budget id should have at least 24 characters' })
  }),
  {
    required_error: "Array of expenses is required",
    invalid_type_error: "The body should be an array",
  }
).min(1, { message: 'Expenses should be at least 1 on the list' });

export default expensesBodySchema;
