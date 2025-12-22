"use client";

import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { Register } from "@/apiCall/auth";
import { useAuth } from "@/context/userContext";
import { useGoogleLogin } from "@react-oauth/google";
import { GoogleIcon } from "@/components/common/GoogleIcon";

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    couponCode: "",
  });
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!data.firstName || !data.lastName || !data.email || !data.password || !data.confirmPassword) {
      toast.error("Please fill all the fields");
      return;
    }
    if (data.password !== data.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (data.password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    try {
      setLoading(true);
      const result = await Register(
        data.firstName,
        data.lastName,
        data.email,
        data.password,
        data.couponCode?.trim() || undefined
      );

      if (result.status === "success") {
        await login(result.user, result.token);
        toast.success(result.message || "Registered successfully!");
        router.push("/create-manuscripthq");
      } else {
        toast.error(result.message || "Registration failed");
      }
    } catch (error) {
      toast.error(error?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  // GOOGLE SIGNUP (parity with RN)
  const signupWithGoogle = useGoogleLogin({
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
        // 1) Get profile from Google
        const userInfoRes = await fetch("https://www.googleapis.com/userinfo/v2/me", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (!userInfoRes.ok) throw new Error("Failed to fetch Google user info");
        const userInfo = await userInfoRes.json();

        // 2) Build payload exactly like RN
        const payload = {
          firstName: userInfo?.given_name,
          lastName: userInfo?.family_name,
          profilepicture: userInfo?.picture,
          email: userInfo?.email,
        };

        // 3) Send to backend (JSON)
        const apiRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || "https://apis.manuscripthq.com/api"}/user/signup-with-google`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const result = await apiRes.json();

        // 4) Handle response same as RN
        if (result?.status === "success") {
          await login(result.user, result.token);
          toast.success("Signed in with Google!");
          router.replace("/create-manuscripthq");
        } else {
          toast.error(result?.message || "Google Sign In failed.");
        }
      } catch (err) {
        toast.error(err?.message || "Google Sign In error.");
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
        <form onSubmit={handleSignUp} className="space-y-4" noValidate>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First name</Label>
              <Input
                id="firstName"
                name="firstName"
                placeholder="John"
                value={data.firstName}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last name</Label>
              <Input
                id="lastName"
                name="lastName"
                placeholder="Doe"
                value={data.lastName}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="name@example.com"
              value={data.email}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="pr-10"
                value={data.password}
                onChange={handleChange}
                disabled={loading}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 py-2 text-primary"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                {showPassword ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                <span className="sr-only">
                  {showPassword ? "Hide password" : "Show password"}
                </span>
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Password must be at least 8 characters long and include a number and a special character.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                name="confirmPassword"
                placeholder="••••••••"
                type={showPassword ? "text" : "password"}
                className="pr-10"
                value={data.confirmPassword}
                onChange={handleChange}
                disabled={loading}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 py-2 text-primary"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                {showPassword ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                <span className="sr-only">
                  {showPassword ? "Hide password" : "Show password"}
                </span>
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="couponCode">Coupon code (optional)</Label>
            <Input
              id="couponCode"
              name="couponCode"
              placeholder="e.g. LAUNCH25"
              value={data.couponCode}
              onChange={handleChange}
              disabled={loading}
            />
            <p className="text-xs text-muted-foreground mt-1">If you have a coupon, enter it here.</p>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="cursor-pointer w-full bg-primary text-white font-medium py-3 rounded-lg "
          >
            {loading ? "Creating account..." : "Create account"}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            By creating an account, you agree to our{" "}
            <Link target="_blank" href="https://manuscripthq.com/terms-of-service" className="underline underline-offset-2 text-primary">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link target="_blank" href="https://manuscripthq.com/privacy-policy" className="underline underline-offset-2 text-primary">
              Privacy Policy
            </Link>.
          </p>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t " />
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
            onClick={() => !googleLoading && signupWithGoogle()}
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
