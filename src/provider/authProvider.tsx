import { IAuth } from "@/types";
import { PropsWithChildren, createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext<IAuth>({ token: null, setToken: () => null });

const AuthProvider = ({ children }: PropsWithChildren) => {
  // State to hold the authentication token
  const [token, setToken_] = useState(document.cookie);

  // Function to set the authentication token
  const setToken = (newToken?: string) => {
    setToken_(newToken ? newToken : "");
  };

  useEffect(() => {
    if (token) {
      document.cookie = "loggedUntil=" + new Date(token).toUTCString() + "; expires = " + new Date(token).toUTCString();
    } else {
      document.cookie = "loggedUntil=;expires=" + new Date().toUTCString();
    }
  }, [token]);

  // Memoized value of the authentication context
  const contextValue = useMemo(() => ({ token, setToken }), [token]);

  // Provide the authentication context to the children components
  return (<AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>);
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthProvider;