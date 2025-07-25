import { API_URL } from "@/lib/constants";
import { getCurrentUser, getUserToken } from "@/server/actions/auth";

export const reportQueries = {
  async getMentorCurrentStages() {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error("User not found");
    }

    const res = await fetch(
      `${API_URL}/api/Reports/mentorCurrentStages?mentorId=${user.id}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      },
    );

    const data = (await res.json()) as {
      studentId: string;
      roadmapStages: {
        stageId: number;
        title: string;
        order: number;
      }[];
      currentStageId: number;
      currentStageTitle: string;
    }[];
    return data;
  },

  async getStruggleStudentsForMentor() {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error("User not found");
    }

    const res = await fetch(
      `${API_URL}/api/Reports/mentorStruggleStages?mentorId=${user.id}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      },
    );

    const data = (await res.json()) as {
      studentId: string;
      stageId: number;
      stageTitle: string;
      timeSpent: number;
      expectedDuration: number;
      timeOverdue: number;
    }[];

    return data;
  },

  async getWeeklyActiveTime(studentId: string, weekStart: Date) {
    const token = await getUserToken();
    if (!token) {
      throw new Error("User not found");
    }

    const res = await fetch(`${API_URL}/api/Reports/weeklyActiveTime`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        userId: studentId,
        weekStart: weekStart.toISOString(),
      }),
    });

    const data = (await res.text()) as unknown;
    console.log("[data]", data);
    return data;
  },
};
