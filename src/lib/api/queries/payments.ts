import { API_URL } from "@/lib/constants";
import { getUserToken } from "@/server/actions/auth";

export const paymentsQueries = {
  async capturePaypalPayment(token: string) {
    const userToken = await getUserToken();
    if (!userToken) {
      throw new Error("No token found");
    }

    const response = await fetch(
      `${API_URL}/api/Payment/capture?orderId=${token}`,
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      },
    );

    const data = (await response.json()) as {
      statusCode: number;
      reportMessage: string;
    };
    return data;
  },
};
