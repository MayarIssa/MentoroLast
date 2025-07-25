import { API_URL } from "@/lib/constants";
import { getUserToken } from "@/server/actions/auth";

export const roadmapQueries = {
  async getRoadmap() {
    const token = await getUserToken();

    if (!token) {
      throw new Error("User not authenticated");
    }

    const response = await fetch(`${API_URL}/api/Plan/StudentStages`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch roadmaps");
    }

    const data = (await response.json()) as {
      roadmaps: {
        roadmap: {
          id: number;
          title: string;
          description: string;
          duration: string;
          mentorName: string;
        };
        stages: {
          id: number;
          title: string;
          description: string;
          order: number;
          roadmapPlanId: number;
          resources: {
            title: string;
            description: string;
            filePaths: string;
            urls: string;
          }[];
          status: string;
        }[];
      }[];
    };

    return data;
  },
};
