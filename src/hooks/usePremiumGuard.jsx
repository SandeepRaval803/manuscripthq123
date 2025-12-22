import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/context/userContext";

/**
 * Custom hook to protect premium routes
 * Redirects non-premium users to subscription page
 */
export const usePremiumGuard = () => {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    // Don't check until auth is loaded
    if (loading) return;

    // Check if user has premium subscription
    const isPremiumUser = user?.subscription === "Premium";
    
    if (!isPremiumUser) {
      // Redirect to subscription page with upgrade message
      router.replace("/dashboard/subscription?upgrade=required");
    }
  }, [user, loading, router]);

  return {
    isPremiumUser: user?.subscription === "Premium",
    isLoading: loading,
    user
  };
};
