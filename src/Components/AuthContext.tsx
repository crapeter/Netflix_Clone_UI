import React, {
  createContext,
  useState,
  useContext,
  useEffect,
} from "react";

import type { ReactNode, Dispatch, SetStateAction } from "react";

interface AuthContextType {
  isLoggedIn: boolean;
  setIsLoggedIn: Dispatch<SetStateAction<boolean>>;
  isAdmin: boolean;
  setIsAdmin: Dispatch<SetStateAction<boolean>>;
  userEmail: string;
  setUserEmail: Dispatch<SetStateAction<string>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    const storedValue = localStorage.getItem("isLoggedIn");
    return storedValue === "true";
  });

  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    const storedValue = localStorage.getItem("isAdmin");
    return storedValue === "true";
  });

  const [userEmail, setUserEmail] = useState<string>(() => {
    return localStorage.getItem("userEmail") || "";
  });

  useEffect(() => {
    localStorage.setItem("isLoggedIn", isLoggedIn.toString());
  }, [isLoggedIn]);

  useEffect(() => {
    localStorage.setItem("isAdmin", isAdmin.toString());
  }, [isAdmin]);

  useEffect(() => {
    if (userEmail) {
      localStorage.setItem("userEmail", userEmail);
    }
  }, [userEmail]);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        isAdmin,
        setIsAdmin,
        userEmail,
        setUserEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

