"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { resetPassword } from "@/apiCall/auth";

export default function ResetPasswordForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(null);

  const router = useRouter();

  // Load token once on component mount
  useEffect(() => {
    const otpDataRaw = localStorage.getItem("otpData");
    if (!otpDataRaw) {
      toast.error(
        "Session expired or invalid. Please request password reset again."
      );
      router.replace("/forgot-password");
      return;
    }

    try {
      const otpData = JSON.parse(otpDataRaw);
      if (!otpData.authToken) {
        toast.error(
          "Authentication token missing. Please request password reset again."
        );
        router.replace("/forgot-password");
        return;
      }
      setToken(otpData.authToken);
    } catch (error) {
      toast.error("Invalid session data. Please request password reset again.");
      router.replace("/forgot-password");
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      toast.error("Authentication token missing. Please login.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    // Password validation (example)
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);
      const result = await resetPassword(password, token);

      if (result.status === "success") {
        toast.success("Password reset successfully!");
        localStorage.removeItem("otpData"); // clear sensitive data
        router.push("/");
      } else {
        toast.error(result.message || "Failed to reset password");
      }
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="password">New password</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                required
                className="pr-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm new password</Label>
            <div className="relative">
              <Input
                id="confirm-password"
                name="confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                required
                className="pr-10"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 py-2 text-primary"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <Eye className="h-4 w-4" />
                ) : (
                  <EyeOff className="h-4 w-4" />
                )}
                <span className="sr-only">
                  {showConfirmPassword ? "Hide password" : "Show password"}
                </span>
              </Button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="cursor-pointer w-full bg-primary text-white font-medium py-3 rounded-lg"
          >
            {loading ? "Resetting..." : "Reset password"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
