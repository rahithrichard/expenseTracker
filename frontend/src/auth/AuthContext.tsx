import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { getCurrentSession, loginUser, logoutUser, signupUser, type LoginResponse, type SignupCredentials } from "../services/loginApiService";
import type { LoginCredentials } from "../types/logincredentials"

interface AuthContextType {
  user: LoginResponse | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials,url:string) => Promise<void>;
  signup: (credentials: SignupCredentials) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<LoginResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getCurrentSession()
      .then((session) => {
        if (active) setUser(session);
      })
      .catch(() => {
        if (active) setUser(null);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const login = async (credentials: LoginCredentials,url:string) => {
    const data = await loginUser(credentials,url);
    setUser(data);
  };

  const signup = async (credentials: SignupCredentials) => {
    const data = await signupUser(credentials);
    setUser(data);
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch {
      // Clear local auth state even when the server cannot be reached.
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        isLoading,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}