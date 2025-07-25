import { API_URL } from "@/lib/constants";
import { getCurrentUser } from "@/server/actions/auth";

export const paypalMutations = {
  async createPayment(values: {
    Amount: number;
    RoadManpId: number;
    RoadMapTitle: string;
    mentorId: number;
  }) {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error("User not found");
    }

    const res = await fetch(`${API_URL}/api/Payment/CreatePaypalRequest`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({
        ...values,
        UserId: user.userId,
        Currency: "USD",
        ReturnUrl: `${window.location.origin}/student-dashboard/payment-requests/confirm`,
        CancelUrl: `${window.location.origin}/student-dashboard/payment-requests/cancel`,
      }),
    });

    if (!res.ok) {
      throw new Error("Failed to create payment");
    }

    const data = (await res.json()) as { url: string };
    return data;
  },
};
