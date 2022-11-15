import { Session, User } from "@supabase/supabase-js";
import React, { createContext, useContext } from "react";
import SecureStorage from "../lib/SecureStorage";

export class AuthState {
  session?: Session;
  user?: User;
}

//Creation of the Context
const AuthProviderContext = createContext<
  { auth: AuthState; setAuth: Function } | undefined
>(undefined);

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [auth, setAuthState] = React.useState(new AuthState());

  // Get current auth state from SecureStorage
  const getAuthState = async () => {
    try {
      const authDataString = await SecureStorage.getItem("auth");
      let authData = {};
      if (authDataString != null) {
        authData = JSON.parse(authDataString);
      }

      setAuthState(authData);
    } catch (err) {
      setAuthState({});
    }
  };

  // Update SecureStorage & context state
  const setAuth = async (auth: AuthState) => {
    try {
      await SecureStorage.save("auth", JSON.stringify(auth));
      // Configure axios headers
      setAuthState(auth);
    } catch (error) {
      Promise.reject(error);
    }
  };

  React.useEffect(() => {
    getAuthState();
  }, []);

  return (
    <AuthProviderContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthProviderContext.Provider>
  );
}

function useAuth(): {
  auth: AuthState;
  setAuth: Function;
} {
  const context = useContext(AuthProviderContext);

  if (context == undefined) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}

export { AuthProvider, useAuth };
