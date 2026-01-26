import API from "./axios";

/**
 * Create a new expense
 */
export const createExpense = (expenseData) =>
  API.post("/expenses", expenseData);

/**
 * Get expenses with optional filters
 * filters = { month, year, category }
 */
export const getExpenses = (filters = {}) =>
  API.get("/expenses", { params: filters });

/**
 * Update an expense
 */
export const updateExpense = (id, expenseData) =>
  API.put(`/expenses/${id}`, expenseData);

/**
 * Delete an expense
 */
export const deleteExpense = (id) =>
  API.delete(`/expenses/${id}`);
