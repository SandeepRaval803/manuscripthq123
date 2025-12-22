"use client";

import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/context/userContext";
import { ComponentLoading } from "./PageLoading";

// Define premium-only routes
const PREMIUM_ROUTES = [
  "/dashboard/manuscript",
  "/dashboard/editor", 
  "/dashboard/formatting-wizard",
  "/dashboard/marketing",
  "/dashboard/distribution"
];

export default function PremiumRouteGuard({ children }) {
  const router = useRouter();
  const { user, loading } = useAuth();
  const currentPath = router.pathname;

  useEffect(() => {
    // Don't check until auth is loaded
    if (loading) return;

    // Check if current route is premium-only
    const isPremiumRoute = PREMIUM_ROUTES.some(route => 
      currentPath.startsWith(route)
    );

    if (isPremiumRoute) {
      // Check if user has premium subscription
      const isPremiumUser = user?.subscription === "Premium";
      
      if (!isPremiumUser) {
        // Redirect to subscription page with a message
        router.replace("/dashboard/subscription?upgrade=required");
        return;
      }
    }
  }, [currentPath, user, loading, router]);

  // Show loading while checking auth
  if (loading) {
    return <ComponentLoading />;
  }

  // Check if current route is premium-only
  const isPremiumRoute = PREMIUM_ROUTES.some(route => 
    currentPath.startsWith(route)
  );

  // If it's a premium route and user is not premium, don't render children
  if (isPremiumRoute && user?.subscription !== "Premium") {
    return <ComponentLoading message="Redirecting to subscription..." />;
  }

  // Render children if user has access
  return children;
}
