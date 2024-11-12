import React, { createContext, useState, useEffect, useCallback } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState({
    isLoggedIn: false,
    username: "",
    token: null,
    tokenExpiry: null
  });

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("tokenExpiry");
    setAuth({
      isLoggedIn: false,
      username: "",
      token: null,
      tokenExpiry: null
    });
  }, []);

  const login = (username, token, expiresIn) => {
    const expiryTime = new Date().getTime() + expiresIn;
    localStorage.setItem("token", token);
    localStorage.setItem("username", username);
    localStorage.setItem("tokenExpiry", expiryTime.toString());
    
    setAuth({
      isLoggedIn: true,
      username,
      token,
      tokenExpiry: expiryTime
    });
  };

  // Check token expiration on mount and after any auth state changes
  useEffect(() => {
    const checkTokenExpiration = () => {
      const token = localStorage.getItem("token");
      const username = localStorage.getItem("username");
      const tokenExpiry = localStorage.getItem("tokenExpiry");

      if (token && username && tokenExpiry) {
        const currentTime = new Date().getTime();
        if (currentTime > parseInt(tokenExpiry)) {
          // Token has expired
          logout();
        } else {
          // Token is still valid
          setAuth({
            isLoggedIn: true,
            username,
            token,
            tokenExpiry: parseInt(tokenExpiry)
          });

          // Set timeout to logout when token expires
          const timeUntilExpiry = parseInt(tokenExpiry) - currentTime;
          setTimeout(logout, timeUntilExpiry);
        }
      }
    };

    // Check token expiration immediately
    checkTokenExpiration();

    // Set up interval to check token expiration every minute
    const interval = setInterval(checkTokenExpiration, 60000);

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, [logout]);

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
