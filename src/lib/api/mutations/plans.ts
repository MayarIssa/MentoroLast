import type {
  TCustomizedPlanSchema,
  TRoadmapPlanSchema,
} from "@/app/(protected)/mentor-dashboard/plan/create/_components/plan-form";

import type { TGuidancePlanSchema } from "@/app/(protected)/mentor-dashboard/plan/create/_components/plan-form";
import { API_URL } from "@/lib/constants";
import { getCurrentUser, getUserToken } from "@/server/actions/auth";

export const plansMutations = {
  async createCustomizedPlan(values: TCustomizedPlanSchema) {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error("User not authorized");
    }

    const res = await fetch(
      `${API_URL}/api/Plan/CustomPlan?Type=Customized&Description=${values.description}&Price=${values.price}&Duration=${values.duration} ${values.durationType}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
      },
    );

    const data = (await res.json()) as object;
    return data;
  },

  async createGuidancePlan(values: TGuidancePlanSchema) {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error("User not authorized");
    }

    const res = await fetch(
      `${API_URL}/api/Plan/ConsultantPlan?Type=Consultant&Description=${values.description}&Price=${values.price}&Duration=${values.duration} ${values.durationType}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
      },
    );

    const data = (await res.json()) as object;
    return data;
  },

  async createRoadmapPlan(values: TRoadmapPlanSchema) {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error("User not authorized");
    }

    const bodyData = {
      Type: values.type,
      Description: values.description,
      Price: values.price,
      Duration: `${values.duration} ${values.durationType}`,
      Stages: values.stages.map((stage) => ({
        Title: stage.title,
        Description: stage.description,
        Order: stage.order,
        expectedDuration: stage.expectedDuration,
        ResourceIds: stage.resources,
      })),
    };

    const res = await fetch(`${API_URL}/api/Plan/RoadmapPlan`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${user.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bodyData),
    });

    const data = await res.text();
    return data;
  },

  async deletePlan(planType: string) {
    const token = await getUserToken();
    if (!token) {
      throw new Error("User not authorized");
    }

    const res = await fetch(
      `${API_URL}/api/Plan/DeletePlan?planType=${planType}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const data = await res.text();
    return data;
  },

  async requestPlan(goal: string, mentorId: string, planTitle: string) {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error("User not authorized");
    }

    const bodyData = {
      requestDTO: {},
      StudentId: user.id,
      MentorId: mentorId,
      Goal: goal,
      PlanTitle: planTitle,
    };

    const res = await fetch(`${API_URL}/api/Request/studentrequest`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${user.token}`,
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(bodyData),
    });

    const data = await res.text();
    return data;
  },
};
