import { API_URL } from "@/lib/constants";
import { getUserToken } from "@/server/actions/auth";

export const requestsMutations = {
  acceptRequest: async (requestId: string) => {
    const token = await getUserToken();
    if (!token) {
      throw new Error("User not found");
    }

    const response = await fetch(
      `${API_URL}/api/Request/AcceptRequest?RequestId=${requestId}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.json() as Promise<{
      message: string;
    }>;
  },

  rejectRequest: async (requestId: string) => {
    const token = await getUserToken();
    if (!token) {
      throw new Error("User not found");
    }

    const response = await fetch(
      `${API_URL}/api/Request/RejectRequest?RequestId=${requestId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.json() as Promise<{
      message: string;
    }>;
  },
};
