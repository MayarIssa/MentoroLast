import { API_URL } from "@/lib/constants";
import { getUserToken } from "@/server/actions/auth";

export const studentsQueries = {
  async getStudentProgress(stageId: number) {
    const token = await getUserToken();

    if (!token) {
      throw new Error("No token found");
    }

    const response = await fetch(
      `${API_URL}/api/Student/progress?StageId=${stageId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error("Failed to get student progress");
    }

    return response.text();
  },
};
