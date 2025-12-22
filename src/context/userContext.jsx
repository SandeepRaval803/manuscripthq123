"use client"; // Only needed in /app directory, can be removed for /pages

import { router } from "next/router";
import React, { createContext, useState, useEffect, useContext } from "react";

const UserAuthContext = createContext();

export function UserAuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthValid, setIsAuthValid] = useState(false);

  // Load user from localStorage (client-side only)
  useEffect(() => {
    const savedUser =
      typeof window !== "undefined" && localStorage.getItem("user");
    const savedToken =
      typeof window !== "undefined" && localStorage.getItem("token");
    if (savedToken) setToken(savedToken);
    if (savedUser) setUser(JSON.parse(savedUser));
    setLoading(false);
  }, []);

  // Example login
  const login = async (userData, token) => {
    // Here, replace with your API call
    setUser(userData);
    setToken(token);
    setIsAuthValid(true);
    setAuthChecked(true);
    if (typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", token);
    }
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    if (typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
  };

  // logout
  const logout = () => {
    setUser(null);
    setToken(null);
    setIsAuthValid(false);
    setAuthChecked(true);
    if (typeof window !== "undefined") {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      router.push("/");
    }
  };

  const isAuthenticated = async () => {
    // If we've already checked and have a cached result, return it
    if (authChecked) {
      return isAuthValid;
    }

    try {
      // Check if token exists
      if (!token) {
        setIsAuthValid(false);
        setAuthChecked(true);
        return false;
      }

      // Call your API to validate the token
      const response = await fetch(
        "https://apis.manuscripthq.com/api/user/authenticate-token",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "auth-token": token,
          },
        }
      );

      const data = await response.json();

      const isValid = data.status === "success" && data.data.isValid === true;
      setIsAuthValid(isValid);
      setAuthChecked(true);
      
      // Return true if token is valid, false otherwise
      return isValid;
    } catch (error) {
      console.error("Authentication check failed:", error);
      setIsAuthValid(false);
      setAuthChecked(true);
      return false;
    }
  };

  return (
    <UserAuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        updateUser,
        token,
        isAuthenticated,
        authChecked,
        isAuthValid,
      }}
    >
      {children}
    </UserAuthContext.Provider>
  );
}

// Custom hook for using auth context
export const useAuth = () => useContext(UserAuthContext);
