"use client";

import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import toast from "react-hot-toast";
import { Login } from "@/apiCall/auth";
import { useAuth } from "@/context/userContext";
import { useGoogleLogin } from "@react-oauth/google";
import  {GoogleIcon}  from "../../common/GoogleIcon";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userData = await Login(email, password);
      if (userData.status === "success") {
        await login(userData.user, userData.token);
        if (userData?.user?.isManuscript === false) {
          router.push("/create-manuscripthq");
        } else {
          toast.success(userData.message);
          router.push("/dashboard");
        }
        setEmail("");
        setPassword("");
      } else {
        if (
          userData.message?.toLowerCase().includes("password") ||
          userData.message?.toLowerCase().includes("credentials")
        ) {
          toast.error("Invalid password");
        } else {
          toast.error(userData.message);
        }
      }
    } catch (error) {
      if (
        error?.message?.toLowerCase().includes("password") ||
        error?.message?.toLowerCase().includes("credentials")
      ) {
        toast.error("Invalid password");
      } else {
        toast.error(error?.message || "Login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  // GOOGLE LOGIN (same flow as RN)
  const loginWithGoogle = useGoogleLogin({
    flow: "implicit",
    scope: "profile email",
    onSuccess: async (tokenResponse) => {
      const accessToken = tokenResponse?.access_token;
      if (!accessToken) {
        toast.error("Missing access token from Google");
        return;
      }
      setGoogleLoading(true);
      const hide = toast.loading("Signing in with Google...");
      try {
        // 1) Get email from Google
        const userInfoRes = await fetch(
          "https://www.googleapis.com/userinfo/v2/me",
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        if (!userInfoRes.ok)
          throw new Error("Failed to fetch Google user info");
        const userInfo = await userInfoRes.json();
        const email = userInfo?.email;
        if (!email) throw new Error("Google email not available");

        // 2) Send to backend
        const body = new URLSearchParams();
        body.append("email", email);
        const res = await fetch(
          "https://apis.manuscripthq.com/api/user/signin-with-google",
          {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: body.toString(),
          }
        );
        const result = await res.json();

        // 3) Handle response
        if (result?.status === "success") {
          await login(result.user, result.token);
          toast.success("Login Successfully!");
          if (result?.user?.isManuscript === false) {
            router.replace("/create-manuscripthq");
          } else {
            router.replace("/dashboard");
          }
        } else {
          toast.error(result?.message || "Invalid email or password.");
        }
      } catch (err) {
        toast.error(err?.message || "Network error.");
      } finally {
        toast.dismiss(hide);
        setGoogleLoading(false);
      }
    },
    onError: () => toast.error("Google Sign-In failed"),
  });

  return (
    <Card>
      <CardContent className="pt-6">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link href="/forgot-password" className="text-xs text-primary">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="pr-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 py-2 text-primary"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <Eye className="h-4 w-4" />
                ) : (
                  <EyeOff className="h-4 w-4" />
                )}
                <span className="sr-only">
                  {showPassword ? "Hide password" : "Show password"}
                </span>
              </Button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="cursor-pointer w-full bg-primary text-white font-medium py-3 rounded-lg"
          >
            {loading ? "Signing in..." : "Sign in"}
          </Button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

            <Button
              type="button"
              variant="outline"
              onClick={() => !googleLoading && loginWithGoogle()}
              disabled={googleLoading}
              className="w-full flex items-center justify-center gap-2"
            >
              <GoogleIcon className="w-4 h-4" />
              {googleLoading ? "Processing..." : "Google"}
            </Button>
        </form>
      </CardContent>
    </Card>
  );
}
