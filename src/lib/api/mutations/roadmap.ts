import { API_URL } from "@/lib/constants";
import { getCurrentUser } from "@/server/actions/auth";

export const roadmapMutations = {
  async startStage(stageId: number) {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error("User not found");
    }

    const response = await fetch(
      `${API_URL}/api/Student/startStage?stageId=${stageId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          StudentId: user.id,
        }),
      },
    );

    if (!response.ok) {
      throw new Error("Failed to start stage");
    }

    return response.text();
  },

  async completeStage(stageId: number) {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error("User not found");
    }

    const response = await fetch(
      `${API_URL}/api/Student/completeStage?stageId=${stageId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          StudentId: user.id,
        }),
      },
    );

    if (!response.ok) {
      throw new Error("Failed to complete stage");
    }

    return response.text();
  },
};
