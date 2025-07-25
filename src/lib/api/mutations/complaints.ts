import { API_URL } from "@/lib/constants";
import { getCurrentUser } from "@/server/actions/auth";

export const complaintsMutations = {
  async createComplaint(complaint: string) {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error("Unauthorized");
    }

    const response = await fetch(`${API_URL}/api/Complaints/CreateComplaint`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({
        userId: user.userId,
        content: complaint,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to create complaint");
    }

    return response.json() as object;
  },
};
