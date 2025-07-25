import { API_URL } from "@/lib/constants";
import { getCurrentUser } from "@/server/actions/auth";

export type Complaint = {
  content: string;
  createdAt: string;
  id: number;
  notes: string;
  resonOfRejection: string;
  status: string;
  userId: string;
  userName: string;
};

export const complaintsQuery = {
  async getComplaints() {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error("Unauthorized");
    }

    const response = await fetch(
      `${API_URL}/api/Complaints/GetAllUserComplaints/${user.userId}`,
      {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      },
    );

    return response.json() as Promise<Complaint[]>;
  },
};
