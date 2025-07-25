import type { RequestMentorFormValues } from "@/app/(protected)/student-dashboard/(index)/[mentorId]/_components/request-mentor-form";
import { API_URL } from "@/lib/constants";
import { getCurrentUser } from "@/server/actions/auth";

export const mentorMutations = {
  requestMentor: async (mentorId: string, request: RequestMentorFormValues) => {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error("User not found");
    }

    const response = await fetch(`${API_URL}/api/Request/studentrequest`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({
        MentorId: mentorId,
        StudentId: user.id,
        PlanTitle: request.plan,
        Goal: request.goal,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to request mentor");
    }

    return response.json() as Promise<{
      success: boolean;
      message: string;
    }>;
  },
};
