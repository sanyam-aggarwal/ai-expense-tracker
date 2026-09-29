import { apiRequest } from "../ApiService";

export const getExpenses = () => apiRequest("/expense?size=50");
export const createExpense = (expense) =>
  apiRequest("/expense", { method: "POST", body: JSON.stringify(expense) });
export const updateExpense = (id, expense) =>
  apiRequest(`/expense/${id}`, { method: "PATCH", body: JSON.stringify(expense) });
export const deleteExpense = (id) => apiRequest(`/expense/${id}`, { method: "DELETE" });
