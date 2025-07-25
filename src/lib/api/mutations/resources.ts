import { API_URL } from "@/lib/constants";
import { getCurrentUser } from "@/server/actions/auth";

export const resourcesMutations = {
  async addResource(formData: FormData) {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error("User not authorized");
    }

    const res = await fetch(`${API_URL}/api/Resources/CreateResource`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
      body: formData,
    });

    const data = await res.text();
    const resourceId = Number(data.split(" ")[3]);
    return { resourceId };
  },

  async editResource(formData: FormData) {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error("User not authorized");
    }

    const res = await fetch(`${API_URL}/api/Resources/UpdateResource`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
      body: formData,
    });

    const data = await res.text();
    const resourceId = Number(data.split(" ")[3]);
    return { resourceId };
  },

  async deleteResource(resourceId: number) {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error("User not authorized");
    }

    const res = await fetch(
      `${API_URL}/api/Resources/DeleteResource?Id=${resourceId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      },
    );

    return res.ok;
  },

  async assignResource(resourceId: number, studentId: number) {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error("User not authorized");
    }

    console.log("[resourceId]", resourceId);
    console.log("[studentId]", studentId);

    const res = await fetch(
      `${API_URL}/api/Resources/AssignResourceToStudent`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentId,
          resourceId,
        }),
      },
    );

    return res.ok;
  },

  async unassignResource(resourceId: number, studentId: number) {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error("User not authorized");
    }

    const respone = await fetch(
      `${API_URL}/api/Resources/RemoveResourceFromStudent`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentId,
          resourceId,
        }),
      },
    );

    return respone.ok;
  },
};
