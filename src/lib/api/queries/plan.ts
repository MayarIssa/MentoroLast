import { API_URL } from "@/lib/constants";
import type { Plan } from "@/lib/types/plans";
import { getUserToken } from "@/server/actions/auth";

export const plansQueries = {
  async getPlans(): Promise<Plan[]> {
    const token = await getUserToken();
    if (!token) {
      throw new Error("User not found");
    }

    try {
      const response = await fetch(`${API_URL}/api/Mentor/MentorPlans`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        console.error(`API error: ${response.status} ${response.statusText}`);
        return [];
      }

      const data = (await response.json()) as {
        mentorId: number;
        plansList: Plan[];
      };
      return data.plansList;
    } catch (error) {
      console.error("Error fetching plans:", error);
      return [];
    }
  },

  // Needs a mentorId in body and get requests doesn't allow it
  async getRoadmapContent() {
    const token = await getUserToken();
    if (!token) {
      throw new Error("User not found");
    }

    const response = await fetch(
      `${API_URL}/api/Plan/RoadmapPlanWithResources`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const data = (await response.json()) as object;
    return data;
  },
};
