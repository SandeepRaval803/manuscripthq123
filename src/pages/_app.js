import { useAuth, UserAuthProvider } from "@/context/userContext";
import "@/styles/globals.css";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { AuthLoading } from "@/components/common/AuthLoading";
import PremiumRouteGuard from "@/components/common/PremiumRouteGuard";
import { GoogleOAuthProvider } from "@react-oauth/google";

function AuthGuard({ children }) {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading, user } = useAuth();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  const authPages = ["/", "/register", "/forgot-password", "/reset-password", "/otp", "/checklistpremium/[token]"];

  useEffect(() => {
    const checkAuth = async () => {
      if (!authLoading) {
        const isAuthPage = authPages.includes(router.pathname);
        const authenticated = await isAuthenticated();
        setIsAuth(authenticated);

        // Force manuscript creation if needed
        if (
          authenticated &&
          user &&
          user.isManuscript === false &&
          router.pathname !== "/create-manuscripthq"
        ) {
          router.replace("/create-manuscripthq");
          setIsCheckingAuth(false);
          return;
        }

        // If authenticated and on /register, go to dashboard
        if (authenticated && router.pathname === "/register") {
          router.replace("/dashboard");
          setIsCheckingAuth(false);
          return;
        }

        // If authenticated and on other auth pages (but not checklist premium), go to dashboard
        if (authenticated && isAuthPage && router.pathname !== "/register" && router.pathname !== "/checklistpremium/[token]") {
          router.replace("/dashboard");
          setIsCheckingAuth(false);
          return;
        }

        // Always allow users to stay on checklist premium page regardless of auth status
        if (router.pathname === "/checklistpremium/[token]") {
          setIsCheckingAuth(false);
          return;
        }

        // If not authenticated and not on an auth page, go to login
        if (!authenticated && !isAuthPage) {
          router.replace("/");
          setIsCheckingAuth(false);
          return;
        }

        setIsCheckingAuth(false);
      }
    };

    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, router.pathname, user]);

  if (authLoading || isCheckingAuth) {
    return <AuthLoading message="Checking authentication..." />;
  }

  const isAuthPage = authPages.includes(router.pathname);

  // NOTE: your earlier check used "/create-manuscript" (without 'hq').
  // Keeping it consistent with "/create-manuscripthq".
  // Always allow access to checklist premium page regardless of auth status
  if (router.pathname === "/checklistpremium/[token]") {
    return children;
  }
  
  if (!isAuthPage && !isAuth && router.pathname !== "/create-manuscripthq") {
    return <AuthLoading message="Authentication required..." />;
  }

  return children;
}

export default function App({ Component, pageProps }) {
  return (
    <GoogleOAuthProvider clientId="898663677077-egb65e9bvlgvlbn6ubpbhaee3ovqjtmn.apps.googleusercontent.com">
      <UserAuthProvider>
        <AuthGuard>
          <PremiumRouteGuard>
            <Component {...pageProps} />
            <Toaster position="top-right" />
          </PremiumRouteGuard>
        </AuthGuard>
      </UserAuthProvider>
    </GoogleOAuthProvider>
  );
}
