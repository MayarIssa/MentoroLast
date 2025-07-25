import { API_URL } from "@/lib/constants";
import { getCurrentUser } from "@/server/actions/auth";

export const accountMutations = {
  async updateMentorProfile(data: FormData) {
    const user = await getCurrentUser();

    if (!user) {
      throw new Error("User not found");
    }

    return fetch(`${API_URL}/api/Account/UpdateMentorProfile`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
      body: data,
    });
  },
};
