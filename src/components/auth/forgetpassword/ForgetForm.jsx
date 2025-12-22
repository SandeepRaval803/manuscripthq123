import React, { useState } from "react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

import { sendForgetPasswordEmail } from "@/apiCall/auth";

export default function ForgetForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await sendForgetPasswordEmail(email);

      if (result.status === "success") {
        // Save email and otpData with consistent keys
        localStorage.setItem("resetEmail", email);
        localStorage.setItem("otpData", JSON.stringify(result.data));

        toast.success("OTP sent! Please check your email.");
        router.push("/otp");
      } else {
        toast.error(result.message || "Failed to send OTP");
      }
    } catch (error) {
      toast.error(error.message || "Error sending OTP. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSendOTP} className="space-y-4">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Button
            type="submit"
            disabled={loading}
            className="cursor-pointer w-full bg-primary text-white font-medium py-3 rounded-lg"
          >
            {loading ? "Sending..." : "Send"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
