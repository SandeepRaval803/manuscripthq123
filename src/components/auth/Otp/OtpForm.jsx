import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { sendForgetPasswordEmail } from "@/apiCall/auth";

export default function OtpForm() {
  const router = useRouter();

  useEffect(() => {
    const otpData = localStorage.getItem("otpData");
    if (!otpData) {
      router.replace("/forgot-password");
    }
  }, [router]);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timer, setTimer] = useState(45);
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);

  const email =
    typeof window !== "undefined" ? localStorage.getItem("resetEmail") : null;
  const otpData =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("otpData") || "{}")
      : {};

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 3) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "");
    const newOtp = [...otp];
    for (let i = 0; i < 4; i++) newOtp[i] = pasted[i] || "";
    setOtp(newOtp);
    const nextIndex = Math.min(pasted.length, 3);
    inputRefs.current[nextIndex]?.focus();
  };

  useEffect(() => {
    if (timer === 0) return;
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const isComplete = otp.every((d) => d !== "");

  const handleVerifyOTP = (e) => {
    e.preventDefault();
    if (!isComplete) return;

    setLoading(true);

    try {
      const storedOtpData = JSON.parse(localStorage.getItem("otpData") || "{}");
      const storedOtp = storedOtpData.otp || "";

      if (otp.join("") === storedOtp) {
        toast.success("OTP verified! You can now reset your password.");
        router.push("/reset-password");
      } else {
        toast.error("Invalid OTP, please try again.");
      }
    } catch {
      toast.error("Verification failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await sendForgetPasswordEmail(email);

      if (result.status === "success") {
        localStorage.setItem("otpData", JSON.stringify(result.data));
        toast.success("OTP sent! Please check your email.");
        setTimer(45); // Reset timer
        setOtp(["", "", "", ""]); // Clear OTP inputs
        inputRefs.current[0]?.focus(); // Optional: Focus first input
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
        <form onSubmit={handleVerifyOTP} className="space-y-6">
          <Label className="text-center block">Verification Code</Label>
          <div className="flex justify-center gap-3">
            {otp.map((digit, i) => (
              <Input
                key={i}
                ref={(el) => (inputRefs.current[i] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                onPaste={i === 0 ? handlePaste : undefined}
                className="w-14 h-14 text-center text-xl font-semibold border-2 focus:border-primary"
                autoComplete="off"
              />
            ))}
          </div>

          <Button
            type="submit"
            disabled={!isComplete || loading}
            className="w-full bg-primary hover:bg-[#B020C4] text-white font-medium py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Verifying..." : "Verify Code"}
          </Button>

          <div className="text-center mt-2">
            <button
              type="button"
              onClick={handleSendOTP}
              disabled={timer > 0 || loading}
              className="text-sm text-purple-600 underline disabled:opacity-50"
            >
              {timer > 0 ? `Resend OTP in ${timer}s` : "Resend OTP"}
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
