import { API_URL } from "@/lib/constants";
import { getUserToken } from "@/server/actions/auth";

export const adminQueries = {
  async getMentorRequests() {
    const token = await getUserToken();
    if (!token) {
      throw new Error("No token found");
    }

    const response = await fetch(`${API_URL}/api/Account/GetMentorRequests`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch mentor requests");
    }

    const data = (await response.json()) as {
      category: string;
      email: string;
      id: number;
      image: string;
      jobTitle: string;
      name: string;
    }[];

    return data;
  },

  async getMentorRequestById(id: number) {
    const token = await getUserToken();
    if (!token) {
      throw new Error("No token found");
    }

    const response = await fetch(
      `${API_URL}/api/Account/GetMentorRequest?id=${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error("Failed to fetch mentor request");
    }

    const data = (await response.json()) as {
      id: number;
      name: string;
      email: string;
      image: string;
      jobTitle: string;
      category: string;
      about: string;
      location: string;
      accountBank: string;
      introVideo: string;
      cv: string;
      linkedin: string;
      github: string;
    };

    return data;
  },

  async getPaymentRequests() {
    const token = await getUserToken();
    if (!token) {
      throw new Error("No token found");
    }

    const response = await fetch(
      `${API_URL}/api/ManualPayment/PaymentRequests`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error("Failed to fetch payment requests");
    }

    const data = (await response.json()) as {
      acceptationOrRejectionDate: string;
      amount: number;
      consultantPlanId: number;
      consultantPlanTitle: string;
      customPlanId: number;
      customPlanTitle: string;
      id: number;
      image: string;
      imagePath: string;
      mentorId: number;
      mentorName: string;
      notes: string;
      requestDate: string;
      resevationAccount: string;
      roadmapPlanId: number;
      roadmapPlanTitle: string;
      senderAccount: string;
      status: string;
      userId: string;
      userName: string;
    }[];

    return data;
  },

  async getPaymentRequestById(id: number) {
    const token = await getUserToken();
    if (!token) {
      throw new Error("No token found");
    }

    const response = await fetch(
      `${API_URL}/api/ManualPayment/PaymentRequest?id=${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    const data = (await response.json()) as {
      id: number;
      amount: number;
      consultantPlanId: number;
      consultantPlanTitle: string;
      customPlanId: number;
      customPlanTitle: string;
      image: string;
      imagePath: string;
      mentorId: number;
      mentorName: string;
      notes: string;
      requestDate: string;
      resevationAccount: string;
      roadmapPlanId: number;
      roadmapPlanTitle: string;
      senderAccount: string;
      status: string;
      userId: string;
      userName: string;
    };
    console.log("[data]", data);

    if (!response.ok) {
      throw new Error("Failed to fetch payment request");
    }

    return data;
  },

  async getAllComplaints() {
    const token = await getUserToken();
    if (!token) {
      throw new Error("No token found");
    }

    const response = await fetch(
      `${API_URL}/api/Complaints/GetAllAdminComplaints`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (response.status === 404) {
      return [];
    }

    if (!response.ok) {
      throw new Error("Failed to fetch complaints");
    }

    const data = (await response.json()) as {
      id: number;
      content: string;
      createdAt: string;
      notes: string;
      reasonOfRejection: string;
      status: string;
      userId: string;
      userName: string;
    }[];

    return data;
  },

  async getArchivedComplaints() {
    const token = await getUserToken();
    if (!token) {
      throw new Error("No token found");
    }

    const response = await fetch(
      `${API_URL}/api/Complaints/GetAllAdminComplaints`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (response.status === 404) {
      return [];
    }

    if (!response.ok) {
      throw new Error("Failed to fetch archived complaints");
    }

    const data = (await response.json()) as {
      content: string;
      createdAt: string;
      id: number;
      notes: string;
      resonOfRejection: string;
      status: string;
      userId: string;
    }[];

    return data;
  },

  async getArchivedPayments() {
    const token = await getUserToken();
    if (!token) {
      throw new Error("No token found");
    }

    const response = await fetch(
      `${API_URL}/api/ManualPayment/ArchivedManualPaymentRequests`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (response.status === 404) {
      return [];
    }

    const data = (await response.json()) as {
      acceptationOrRejectionDate: string;
      amount: number;
      consultantPlanId: number;
      consultantPlanTitle: string;
      customPlanId: number;
      customPlanTitle: string;
      id: number;
      image: string;
      imagePath: string;
      mentorId: number;
      mentorName: string;
      notes: string;
      requestDate: string;
      resevationAccount: string;
      roadmapPlanId: number;
      roadmapPlanTitle: string;
      senderAccount: string;
      status: string;
      userId: string;
      userName: string;
    }[];

    return data;
  },
};
