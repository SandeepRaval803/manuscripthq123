import { Check, Crown, ArrowRight, Lock, Loader2, TabletSmartphone, DollarSign, X, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/router";
import { useAuth } from "@/context/userContext";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { updateUserDetails } from "@/apiCall/auth";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ||
    "pk_live_51RVZpqHDNUtmhWb0dJE5qyCpNeKSAfbFqS2RaU0de9ILnHFFjDg0gwzguVFSfvRIgkfx4LYeidqHbBUc6GqA5gtJ00IVLfPpN4"
);

// Simple Payment Form
const PaymentForm = ({ onSuccess, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/dashboard/subscription?success=true`,
      },
    });

    if (error) {
      toast.error(error.message);
    } else {
      onSuccess();
    }

    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={!stripe || isProcessing}
          className="flex-1 bg-gradient-to-r from-[#CA24D6] to-[#eaa8f9] text-white"
        >
          {isProcessing ? "Processing..." : "Pay Now"}
        </Button>
      </div>
    </form>
  );
};

export default function UltraModernSubscription() {
  const router = useRouter();
  const { user, token, updateUser } = useAuth();
  const [showUpgradeMessage, setShowUpgradeMessage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [clientSecret, setClientSecret] = useState(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const premiumPlanFeatures = [
    "Everything in Free Plan",
    "Writing Analytics",
    "Structured Editing",
    "AI Formatting Tools",
    "Final Manuscript Prep",
    "Priority Customer Support",
    "Advanced Analytics & Insights",
    "Advanced Export Options",
  ];
  const proPlanFeatures = [
    "Full Editing Suite",
    "Beta Reader Management",
    "Manuscript Polish",
    "Advance Cover & formatting",
    "Legal & ISBN Management",
    "Publishing & Distribution Support",
    "Advanced Marketing Tools",
  ];

  useEffect(() => {
    if (router.query.upgrade === "required") setShowUpgradeMessage(true);
    if (router.query.success === "true") {
      // Update the user's subscription in the database
      const updateUserSubscription = async () => {
        try {
          // Get the session ID from URL params
          const urlParams = new URLSearchParams(window.location.search);
          const plan = urlParams.get("plan");
          const sessionId = urlParams.get("session_id");

          let customerId = "";
          let subscriptionId = "";

          // If we have a session ID, get the details from Stripe
          if (sessionId) {
            try {
              const sessionResponse = await fetch(
                `/api/get-session-details?sessionId=${sessionId}`
              );
              if (sessionResponse.ok) {
                const sessionData = await sessionResponse.json();
                customerId = sessionData.customerId || "";
                subscriptionId = sessionData.subscriptionId || "";
              }
            } catch (error) {
              console.error("Error fetching session details:", error);
            }
          } else {
            // Fallback to localStorage for backend API case
            customerId = localStorage.getItem("stripe_customer_id") || "";
            subscriptionId =
              localStorage.getItem("stripe_subscription_id") || "";
          }

          const updateData = {
            subscription: plan === "premium" ? "Premium" : "Pro",
            stripeCustomerId: customerId,
            stripeSubscriptionId: subscriptionId,
            subscriptionStatus: "ACTIVE",
            subscriptionStart: new Date().toISOString(),
            subscriptionEnd: new Date(
              Date.now() + 30 * 24 * 60 * 60 * 1000
            ).toISOString(), // 30 days from today
          };

          const response = await updateUserDetails(updateData, token);
          if (response.status === "success") {
            updateUser(response.user);
            toast.success("Your subscription has been updated to Premium!");
            // Clean up localStorage
            localStorage.removeItem("stripe_customer_id");
            localStorage.removeItem("stripe_subscription_id");
          } else {
            toast.error("Failed to update subscription status");
          }
        } catch (error) {
          console.error("Error updating subscription:", error);
          toast.error("Failed to update subscription status");
        }
      };

      if (token) {
        updateUserSubscription();
      }
    }
  }, []);

  const handlePremiumPlanClick = async (plan) => {
    if (!token) {
      toast.error("Please log in to continue");
      return;
    }

    setIsLoading(true);

    try {
      // Create Stripe checkout session directly from frontend
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          priceId: plan === "premium" ? process.env.NEXT_PUBLIC_STRIPE_PRICE_ID : process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO,
          successUrl: `${window.location.origin}/dashboard/subscription?success=true?plan=${plan}`,
          cancelUrl: `${window.location.origin}/dashboard/subscription`,
        }),
      });

      if (response.ok) {
        const { url } = await response.json();
        // Redirect to Stripe checkout page
        window.location.href = url;
      } else {
        // Fallback to your existing backend
        const backendResponse = await fetch(
          "https://apis.manuscripthq.com/api/stripepayment/subscription-sheet",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "auth-token": token,
            },
            body: JSON.stringify({
              priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID,
            }),
          }
        );

        const data = await backendResponse.json();

        if (data.paymentIntent) {
          // Store the customer and subscription IDs for later use
          if (data.customer) {
            localStorage.setItem("stripe_customer_id", data.customer);
          }
          if (data.subscriptionId) {
            localStorage.setItem("stripe_subscription_id", data.subscriptionId);
          }

          setClientSecret(data.paymentIntent);
          setShowPayment(true);
          toast.success("Payment form ready!");
        } else {
          throw new Error("No payment intent received");
        }
      }
    } catch (error) {
      console.error("Payment setup error:", error);
      toast.error("Failed to setup payment. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!token) {
      toast.error("Please log in to continue");
      return;
    }

    try {
      setIsLoading(true);

      const response = await fetch(
        "https://apis.manuscripthq.com/api/stripepayment/cancel-subscription",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "auth-token": token,
          },
          body: JSON.stringify({
            userId: user?._id,
          }),
        }
      );

      const data = await response.json();

      if (data.status === "success") {
        updateUser(data.user);
        toast.success("Subscription cancelled successfully!");
      } else {
        toast.error(data.message || "Failed to cancel subscription");
      }
    } catch (error) {
      console.error("Error cancelling subscription:", error);
      toast.error("Failed to cancel subscription. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const isPremiumUser = user?.subscription === "Premium";
  const isChecklistProUser = user?.subscription === "Pro";

  // Show Payment Form
  if (showPayment && clientSecret) {
    return (
      <div className="min-h-screen bg-[#fafafa] p-4">
        <div className="max-w-2xl mx-auto">
          <Button
            variant="outline"
            onClick={() => setShowPayment(false)}
            className="mb-4"
          >
            ← Back to Plans
          </Button>
          <h1 className="text-2xl font-bold mb-4">Complete Payment</h1>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <PaymentForm
                onSuccess={() => {
                  toast.success("Payment successful! Redirecting...");
                  // Clear localStorage after successful payment
                  localStorage.removeItem("stripe_customer_id");
                  localStorage.removeItem("stripe_subscription_id");
                }}
                onCancel={() => setShowPayment(false)}
              />
            </Elements>
          </div>
        </div>
      </div>
    );
  }

  // Show Cancel Confirmation Popup
  if (showCancelConfirm) {
    return (
      <div className="min-h-screen bg-[#fafafa] p-4 flex items-center justify-center">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <Crown className="w-8 h-8 text-red-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {isChecklistProUser
                  ? "Cancel Pro Plan?"
                  : "Cancel Premium Plan?"}
              </h2>
              <p className="text-gray-600">
                Are you sure you want to switch back to the{" "}
                {isChecklistProUser ? "Free plan" : "Pro plan"}? You'll lose
                access to all {isChecklistProUser ? "pro" : "premium"} features.
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowCancelConfirm(false)}
                className="flex-1"
              >
                Keep {isChecklistProUser ? "Pro" : "Premium"}
              </Button>
              <Button
                onClick={handleCancelSubscription}
                className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
              >
                Confirm Cancel
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] relative overflow-hidden">
      <div className="relative z-10 p-4 md:p-6 pt-6">
        <div className="mb-8">
          <h1 className="mb-1 text-3xl text-primary font-bold tracking-tight">
            Choose Your Plan
          </h1>
          <p className="text-muted-foreground">
            Select the perfect plan for your writing journey and unlock your
            creative potential{" "}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">

          {/* Premium Plan Card - Second */}
          <div
            className={`relative group h-full ${
              isPremiumUser ? "opacity-100" : "opacity-100"
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#CA24D6]/30 via-[#eaa8f9]/20 to-[#CA24D6]/10 rounded-[2.5rem] blur opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
            <Card
              className={`relative h-full bg-white backdrop-blur-xl border-0 rounded-[2rem] p-8 overflow-hidden transition-all duration-500 ${
                isPremiumUser
                  ? "shadow-2xl ring-2 ring-[#CA24D6]/30"
                  : "shadow-lg group-hover:shadow-xl group-hover:-translate-y-1"
              }`}
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#CA24D6] to-transparent"></div>

              <div className="flex flex-col h-full">
                <div className="mb-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#CA24D6]/10 to-[#eaa8f9]/20 flex items-center justify-center shadow-inner">
                      <Crown className="w-7 h-7 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        Premium Plan
                      </h2>
                      <p className="text-gray-500">
                        {isPremiumUser
                          ? "Your current plan"
                          : "Access to all features"}
                      </p>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="flex items-baseline mb-2">
                      <div className="flex items-baseline gap-3">
                        <span className="text-2xl font-bold text-gray-400 line-through">
                          $49.99
                        </span>
                        <span className="text-4xl font-bold text-primary">
                          $29.99
                        </span>
                      </div>
                      <span className="text-gray-500 ml-3 text-xl">/month</span>
                    </div>
                    <p className="text-sm text-gray-500">
                      {isPremiumUser
                        ? "Active subscription"
                        : "Launch with confidence for just $29.99/mo (first 3 months)."}
                    </p>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-5 mb-10 flex-grow">
                  {premiumPlanFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-[#CA24D6]/20 to-[#eaa8f9]/20 flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 text-primary" />
                      </div>
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Button */}
                <Button
                  className={`w-full font-medium py-6 rounded-xl shadow-lg transition-all duration-300 group ${
                    isPremiumUser
                      ? "bg-gradient-to-r from-red-500 to-red-600 text-white"
                      : "bg-primary hover:bg-primary/90 text-white hover:shadow-lg"
                  }`}
                  onClick={
                    isPremiumUser
                      ? () => setShowCancelConfirm(true)
                      : () => handlePremiumPlanClick("premium")
                  }
                  disabled={isLoading}
                >
                  <span className="flex items-center gap-2">
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        {isPremiumUser
                          ? "Cancel Subscription"
                          : "Select Premium Plan"}
                        <ArrowRight
                          className={`w-4 h-4 transition-transform ${
                            isPremiumUser ? "group-hover:translate-x-1" : ""
                          }`}
                        />
                      </>
                    )}
                  </span>
                </Button>
              </div>
            </Card>
          </div>

          {/* Why Choose Our Platform Card - Third */}
          <div className="relative group h-full">
            <div className="absolute inset-0 bg-gradient-to-br from-[#CA24D6]/30 via-[#eaa8f9]/20 to-[#CA24D6]/10 rounded-[2.5rem] blur opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
            <Card className="relative h-full bg-white backdrop-blur-xl border border-[#CA24D6]/20 rounded-[2rem] p-8 overflow-hidden transition-all duration-500 shadow-lg group-hover:shadow-xl group-hover:-translate-y-1">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#CA24D6] to-transparent"></div>

              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="text-center mb-8">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#CA24D6]/20 to-[#eaa8f9]/20 flex items-center justify-center mx-auto mb-4 shadow-inner">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#CA24D6] to-[#eaa8f9] flex items-center justify-center">
                      <Check className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                    Why Choose Our Platform?
                  </h2>
                  <p className="text-gray-600 text-lg">
                    Experience the difference with our premium features
                  </p>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 gap-6 flex-grow">
                  {/* Feature 1 */}
                  <div className="bg-white/60 rounded-xl p-4 border border-[#CA24D6]/20 hover:border-[#CA24D6]/40 transition-all duration-300 hover:shadow-md">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-[#CA24D6]/20 to-[#eaa8f9]/20 flex items-center justify-center">
                        <DollarSign className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-gray-900 font-semibold mb-1">
                          No Setup Fees
                        </h4>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          Get started immediately without any hidden costs or
                          complicated setup processes
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Feature 2 */}
                  <div className="bg-white/60 rounded-xl p-4 border border-[#CA24D6]/20 hover:border-[#CA24D6]/40 transition-all duration-300 hover:shadow-md">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-[#CA24D6]/20 to-[#eaa8f9]/20 flex items-center justify-center">
                        <X className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-gray-900 font-semibold mb-1">
                          Cancel Anytime
                        </h4>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          No long-term contracts or commitments. Cancel your
                          subscription whenever you want
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Feature 3 */}
                  <div className="bg-white/60 rounded-xl p-4 border border-[#CA24D6]/20 hover:border-[#CA24D6]/40 transition-all duration-300 hover:shadow-md">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-[#CA24D6]/20 to-[#eaa8f9]/20 flex items-center justify-center">
                        <ShieldCheck className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-gray-900 font-semibold mb-1">
                          Secure Payments
                        </h4>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          Your payment information is always protected with
                          bank-level encryption and security
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
