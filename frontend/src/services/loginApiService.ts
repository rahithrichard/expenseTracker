import type {LoginCredentials} from "../types/logincredentials";
import { apiRequest } from "../services/apiClient";

export interface SignupCredentials {
  name: string;
  mobile: string;
  email: string;
  password: string;
}

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

export const signupUser = (credentials: SignupCredentials): Promise<LoginResponse> => {
  return apiRequest<LoginResponse>("user-signup", {
    method: "POST",
    body: credentials,
    signal: AbortSignal.timeout(15000),
  });
};

export const getCurrentSession = (): Promise<LoginResponse> => {
  return apiRequest<LoginResponse>("auth-session", { method: "GET" });
};

export const logoutUser = (): Promise<void> => {
  return apiRequest<void>("user-logout", { method: "POST" });
};

