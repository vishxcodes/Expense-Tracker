import API from "./axios";

// Create or update a budget
export const createBudget = (data) =>
  API.post("/budgets", data);

// Get budgets with usage + alerts
export const getBudgets = (month, year) =>
  API.get("/budgets", {
    params: { month, year },
  });

// Delete a budget
export const deleteBudget = (id) =>
  API.delete(`/budgets/${id}`);
