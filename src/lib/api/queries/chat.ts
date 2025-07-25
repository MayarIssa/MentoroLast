import { getCurrentUser, getUserToken } from "@/server/actions/auth";
import { API_URL } from "@/lib/constants";
import type { AssignedStudent, Message, Assigned } from "@/lib/types/chat";

export const chatQueries = {
  async getAssignedStudents() {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error("User not authorized");
    }

    const res = await fetch(`${API_URL}/api/Chat/assigned-students`, {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch assigned students: ${res.statusText}`);
    }

    const data = (await res.json()) as AssignedStudent[];
    return data;
  },

  async getAssigned() {
    const token = await getUserToken();
    if (!token) {
      throw new Error("User not authorized");
    }

    const res = await fetch(`${API_URL}/api/chat/assignments`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch assignments: ${res.statusText}`);
    }

    const data = (await res.json()) as Assigned[];
    return data;
  },

  async getChatMessages(assignmentId: number) {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error("User not authorized");
    }

    const res = await fetch(`${API_URL}/api/chat/history/${assignmentId}`, {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch chat messages: ${res.statusText}`);
    }

    const data = (await res.json()) as Message[];
    return data;
  },
};
