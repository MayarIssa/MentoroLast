import { API_URL } from "@/lib/constants";
import type { User } from "@/lib/types";
import { getUserToken } from "@/server/actions/auth";

export const mentorsQueries = {
  getMentors: async () => {
    const response = await fetch(`${API_URL}/api/Mentor?PageSize=1000`);

    const data = (await response.json()) as {
      count: number;
      data: {
        id: number;
        name: string;
        userId: string;
        email: string;
        image: string;
        jobTitle: string;
        about: string;
        location: string;
        spotleft: number;
        category: string;
        linkedin: string;
        github: string;
        role: string | null;
        averageRating: number;
        mentorPlans: null;
      }[];
      pageIndex: number;
      pageSize: number;
    };

    return {
      ...data,
      data: data.data.map((mentor) => ({
        ...mentor,
        image: `${API_URL}${mentor.image}`,
      })),
    };
  },

  getMentorById: async (mentorId: string) => {
    const response = await fetch(`${API_URL}/api/Mentor/mentor?id=${mentorId}`);

    const data = (await response.json()) as {
      name: string;
      email: string;
      image: string;
      jobTitle: string;
      about: string;
      location: string;
      spotleft: number;
      category: string;
      linkedin: string;
      github: string;
      mentorPlans: {
        roadmapPlan: {
          id: number;
          title: string;
          description: string;
          duration: string;
          price: number;
        };
        customPlan: {
          id: number;
          title: string;
          description: string;
          duration: string;
          price: number;
        };
        consultantPlan: {
          id: number;
          title: string;
          description: string;
          duration: string;
          price: number;
        };
      };
      token: string | null;
    };

    return data;
  },

  async getStudentRequests() {
    const token = await getUserToken();
    if (!token) {
      throw new Error("User not found");
    }

    const response = await fetch(
      `${API_URL}/api/Request/GetStudentRequestToMentor`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const data = (await response.json()) as User[];
    return data;
  },

  async getAllMentors() {
    const token = await getUserToken();
    if (!token) {
      throw new Error("User not found");
    }

    const response = await fetch(`${API_URL}/api/Mentor?PageSize=1000`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = (await response.json()) as {
      count: number;
      data: User[];
      pageIndex: number;
      pageSize: number;
    };
    return data;
  },

  async getRequestsToMentor() {
    const token = await getUserToken();
    if (!token) {
      throw new Error("User not found");
    }

    const response = await fetch(
      `${API_URL}/api/Request/GetStudentRequestToMentor`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const data = (await response.json()) as {
      goal: string;
      planTitle: string;
      studentName: string;
      id: number;
    }[];
    return data;
  },

  async getStudentAssignedToMentor() {
    const token = await getUserToken();
    if (!token) {
      throw new Error("User not found");
    }

    const response = await fetch(
      `${API_URL}/api/Mentor/GetStudentAssignedToMentor`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const data = (await response.json()) as {
      endDate: string;
      mentorId: number;
      studentName: string;
      planTitle: string;
      startDate: string;
      studentMentorId: number;
      stundetId: number;
    }[];
    return data;
  },

  async getMentorsAssignedToStudent() {
    const token = await getUserToken();
    if (!token) {
      throw new Error("User not found");
    }

    // Get accepted requests for student (which contain mentor information)
    const response = await fetch(
      `${API_URL}/api/Request/AcceptedRequestofStudent`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch student's mentors: ${response.statusText}`,
      );
    }

    const requests = (await response.json()) as {
      goal: string;
      mentorName: string;
      planTitle: string;
      status: string;
    }[];

    // Get all mentors to get their detailed information
    const allMentorsResponse = await fetch(`${API_URL}/api/Mentor`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!allMentorsResponse.ok) {
      throw new Error("Failed to fetch mentors");
    }

    const allMentors = (await allMentorsResponse.json()) as {
      count: number;
      data: {
        id: number;
        name: string;
        userId: string;
        email: string;
        image: string;
        jobTitle: string;
        about: string;
        location: string;
        spotleft: number;
        category: string;
        linkedin: string;
        github: string;
        role: string | null;
        averageRating: number;
        mentorPlans: null;
      }[];
      pageIndex: number;
      pageSize: number;
    };

    // Create a map of mentor names to mentor data
    const mentorMap = new Map<string, (typeof allMentors.data)[0]>();
    allMentors.data.forEach((mentor) => {
      mentorMap.set(mentor.name, mentor);
    });

    // Match requests with mentor details and return enriched data
    const assignedMentors = requests
      .map((request) => {
        const mentorDetails = mentorMap.get(request.mentorName);
        return {
          ...request,
          mentor: mentorDetails
            ? {
                ...mentorDetails,
                image: mentorDetails.image
                  ? `${API_URL}${mentorDetails.image}`
                  : null,
              }
            : null,
        };
      })
      .filter((item) => item.mentor !== null); // Only return items where we found the mentor

    return assignedMentors;
  },
};
