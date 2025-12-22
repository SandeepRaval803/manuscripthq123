import { useAuth } from "@/context/userContext";
import { useCallback } from "react";

/**
 * Custom hook that ensures API calls are only made when authenticated
 * @param {Function} apiFunction - The API function to call
 * @returns {Function} - Wrapped API function that checks authentication first
 */
export const useAuthenticatedApi = (apiFunction) => {
  const { isAuthValid, authChecked, token } = useAuth();

  const authenticatedApiCall = useCallback(
    async (...args) => {
      // Don't make API calls if authentication is not checked or not valid
      if (!authChecked || !isAuthValid || !token) {
        throw new Error("User not authenticated");
      }

      return apiFunction(...args);
    },
    [apiFunction, authChecked, isAuthValid, token]
  );

  return authenticatedApiCall;
};

/**
 * Hook to check if API calls should be made
 * @returns {Object} - Object with shouldMakeApiCall boolean and loading state
 */
export const useApiGuard = () => {
  const { isAuthValid, authChecked, token, user } = useAuth();

  return {
    shouldMakeApiCall: authChecked && isAuthValid && !!token && !!user,
    isLoading: !authChecked,
    isAuthenticated: isAuthValid,
  };
}; 