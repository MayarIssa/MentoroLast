import { API_URL } from "@/lib/constants";
import { getUserToken } from "@/server/actions/auth";

export const adminMutations = {
  acceptMentorRequest: async (requestId: string) => {
    const token = await getUserToken();
    if (!token) {
      throw new Error("User not authorized");
    }

    const response = await fetch(
      `${API_URL}/api/Account/AcceptMentor?mentorRequestId=${requestId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error("Failed to accept mentor request");
    }

    return response.json() as Promise<{
      message: string;
    }>;
  },

  rejectMentorRequest: async (requestId: string) => {
    const token = await getUserToken();
    if (!token) {
      throw new Error("User not authorized");
    }

    const response = await fetch(
      `${API_URL}/api/Account/RejectMentor?mentorRequestId=${requestId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error("Failed to reject mentor request");
    }

    return response.json() as Promise<{
      message: string;
    }>;
  },

  acceptPaymentRequest: async (requestId: number) => {
    const token = await getUserToken();
    if (!token) {
      throw new Error("User not authorized");
    }

    const response = await fetch(
      `${API_URL}/api/ManualPayment/PaymentRequests/${requestId}/Accept`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error("Failed to accept payment request");
    }

    return response.json() as Promise<{
      message: string;
    }>;
  },

  rejectPaymentRequest: async (requestId: number, note: string) => {
    const token = await getUserToken();
    if (!token) {
      throw new Error("User not authorized");
    }

    const formData = new FormData();
    formData.append("notes", note);

    const response = await fetch(
      `${API_URL}/api/ManualPayment/RejectManualPaymentRequest/${requestId}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      },
    );

    if (!response.ok) {
      throw new Error("Failed to reject payment request");
    }

    return response.json() as Promise<{
      message: string;
    }>;
  },
  async acceptComplaint(id: number) {
    const token = await getUserToken();
    if (!token) {
      throw new Error("No token found");
    }

    const response = await fetch(
      `${API_URL}/api/Complaints/AcceptComplaint/${id}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error("Failed to accept complaint");
    }

    return true;
  },

  async rejectComplaint(id: number, notes: string) {
    const token = await getUserToken();
    if (!token) {
      throw new Error("No token found");
    }

    const formData = new FormData();
    formData.append("notes", notes);

    const response = await fetch(
      `${API_URL}/api/Complaints/RejectComplaint/${id}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      },
    );

    if (!response.ok) {
      throw new Error("Failed to reject complaint");
    }

    return true;
  },

  async deleteComplaint(id: number) {
    const token = await getUserToken();
    if (!token) {
      throw new Error("No token found");
    }

    const response = await fetch(
      `${API_URL}/api/Complaints/DeleteComplaint/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error("Failed to delete complaint");
    }

    return true;
  },
};
