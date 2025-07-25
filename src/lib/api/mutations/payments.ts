import { API_URL } from "@/lib/constants";
import { getUserToken } from "@/server/actions/auth";

export const paymentsMutations = {
  async confirmPayment(values: {
    Amount: string;
    ResevationAccount: string;
    SenderAccount: string;
    Image: File;
    UserId: string;
    mentorId: string;
    RoadmapPlanId: string;
    RoadmapPlanTitle: string;
  }) {
    const token = await getUserToken();
    if (!token) {
      throw new Error("User not authorized");
    }

    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      formData.append(key, value);
    });

    const response = await fetch(
      `${API_URL}/api/ManualPayment/CreatePaymentRequest`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      },
    );

    return response.ok;
  },
};
