import { useRouter } from "next/router";
import { useEffect } from "react";
import { useAuth } from "@/context/userContext";

export default function ChecklistPremiumPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { token } = router.query;

  useEffect(() => {
    if (token) {
      fetchUserByToken();
    }
  }, [token]);

  const fetchUserByToken = async () => {
    try {
      const response = await fetch(
        "https://apis.manuscripthq.com/api/user/get-current-user",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.status === "success") {
          login(data.data, token);
          router.push("/dashboard/subscription");
        } else {
          router.push("/");
        }
      } else {
        router.push("/");
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  return <></>;
}
