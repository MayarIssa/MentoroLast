import { API_URL } from "@/lib/constants";
import { getUserToken } from "@/server/actions/auth";

export const requestsQueries = {
  async getStudentRequestsToMentor(mentorId: string) {
    const token = await getUserToken();
    if (!token) {
      throw new Error("User not authorized");
    }

    const response = await fetch(
      `${API_URL}/api/Request/GetStudentRequestToMentor?mentorId=${encodeURIComponent(mentorId)}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch student requests: ${response.statusText}`,
      );
    }

    const data = (await response.json()) as {
      data: {
        id: string;
        studentName: string;
        planTitle: string;
        goal: string;
      }[];
    };
    return { data };
  },

  async getAcceptedRequests() {
    const token = await getUserToken();
    if (!token) {
      throw new Error("User not authorized");
    }
  },

  async getAcceptedRequestsByMentor() {
    const token = await getUserToken();
    if (!token) {
      throw new Error("User not authorized");
    }

    const response = await fetch(
      `${API_URL}/api/Request/AcceptedRequestofStudent`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch accepted requests: ${response.statusText}`,
      );
    }

    const data = (await response.json()) as {
      goal: string;
      mentorName: string;
      planTitle: string;
      status: string;
    }[];

    return data;
  },
};
