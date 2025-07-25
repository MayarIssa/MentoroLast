import { API_URL } from "@/lib/constants";
import type { Resource } from "@/lib/types/resources";
import { getCurrentUser } from "@/server/actions/auth";

export const resourcesQueries = {
  async getResources() {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error("User not authorized");
    }

    const res = await fetch(`${API_URL}/api/Mentor/GetResourceForMentor`, {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });

    const data = (await res.json()) as Omit<Resource, "files" | "urls">[];
    return data;
  },

  async getResourceById(id: number) {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error("User not authorized");
    }

    const res = await fetch(`${API_URL}/api/Resources/GetResource?id=${id}`, {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });

    const data = (await res.json()) as Resource;
    return data;
  },

  async getBlobByPath(path: string) {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error("User not authorized");
    }

    const res = await fetch(`${API_URL}${path}`);
    const data = await res.blob();

    return data;
  },

  async getStudentResources() {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error("User not authorized");
    }

    const response = await fetch(
      `${API_URL}/api/Resources/GetStudentResources`,
      {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      },
    );

    const data = (await response.json()) as Resource[];
    return data;
  },

  async getMentorAssignedResources() {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error("User not authorized");
    }

    const response = await fetch(
      `${API_URL}/api/Resources/GetMentorAssignedResources`,
      {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      },
    );

    const data = (await response.json()) as {
      resourceId: number;
      resourceTitle: string;
      resourceDescription: string;
      studentId: number;
      studentName: string;
      files: string[];
      urls: string[];
    }[];
    return data;
  },
};
