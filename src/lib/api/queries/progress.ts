import { API_URL } from "@/lib/constants";
import { getUserToken } from "@/server/actions/auth";

export const progressQueries = {
  async getProgress(stageId: number) {
    const token = await getUserToken();
    if (!token) {
      throw new Error("User not found");
    }

    const response = await fetch(
      `${API_URL}/api/Student/progress?StageId=${stageId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return (await response.json()) as {
      id: number;
      name: string;
      description: string;
      createdAt: string;
      updatedAt: string;
    };
  },
};
