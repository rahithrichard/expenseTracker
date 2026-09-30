import type { Expense } from "../types/expense";
import { apiRequest } from "../services/apiClient";

export const getExpenses = (url: string, month?: string): Promise<Expense[]> => {
  return apiRequest<Expense[]>(url, {
    method: "GET",
    query: month ? { month } : undefined,
  });
};

// Post method to create a new expense in the backend
export const createExpense = async (
  expense: Omit<Expense, "id" | "date">,url: string
): Promise<Expense> => {
  return apiRequest<Expense>(url, {
    method: "POST",
    body: expense,
  });
};
// Delete method to remove an expense from the backend
export const deleteExpense = (id: string): Promise<void> => {
  return apiRequest<void>(`delete-expense/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
};

export interface Budget {
  monthStart: string;
  amount: number;
}

export const getBudget = (month: string): Promise<Budget> => {
  return apiRequest<Budget>("budget", {
    method: "GET",
    query: { month },
  });
};

export const saveBudget = (amount: number, monthStart: string): Promise<Budget> => {
  return apiRequest<Budget>("save-budget", {
    method: "POST",
    body: { amount, monthStart },
  });
};