import type { Expense } from "../types/expense";
const API_URL = import.meta.env.VITE_API_URL || "/api/";

// GET method to fetch expenses from the backend
export const getExpenses = async (url: string): Promise<Expense[]> => {
  const response = await fetch(API_URL + url);

  if (!response.ok) {
    throw new Error("Failed to fetch expenses");
  }

  return response.json();
};

// Post method to create a new expense in the backend
export const createExpense = async (
  expense: Omit<Expense, "id" | "date">,url: string
): Promise<Expense> => {
  const response = await fetch(API_URL + url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(expense),
  });

  if (!response.ok) {
    throw new Error("Failed to create expense");
  }

  return response.json();
};
// Delete method to remove an expense from the backend
export const deleteExpense = async (id: string): Promise<void> => {
  const response = await fetch(`${API_URL}delete-expense/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete expense");
  }
};