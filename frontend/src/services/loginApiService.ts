import type {LoginCredentials} from "../types/logincredentials";
import { apiRequest } from "../services/apiClient";

export interface LoginResponse {
  id: string | number;
  name: string;
  email: string;
}

export const loginUser = (credentials: LoginCredentials, url: string): Promise<LoginResponse> => {
  return apiRequest<LoginResponse>(url, {
    method: "POST",
    body: credentials,
  });
};

export const getCurrentSession = (): Promise<LoginResponse> => {
  return apiRequest<LoginResponse>("auth-session", { method: "GET" });
};

export const logoutUser = (): Promise<void> => {
  return apiRequest<void>("user-logout", { method: "POST" });
};

