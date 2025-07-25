import { API_URL } from "@/lib/constants";
import type { McqQuestion, SubmissionQuestion, Task } from "@/lib/types/tasks";
import { getUserToken } from "@/server/actions/auth";

export const tasksMutations = {
  async createTask(values: { Title: string; TaskType: "Mcq" | "Submission" }) {
    const token = await getUserToken();
    if (!token) {
      throw new Error("User not found");
    }

    const res = await fetch(`${API_URL}/api/Task/CreateTask`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(values),
    });

    if (!res.ok) {
      throw new Error("Failed to create task");
    }

    const data = (await res.json()) as Task;
    return data;
  },

  async updateTask(values: unknown) {
    const token = await getUserToken();
    if (!token) {
      throw new Error("User not found");
    }

    const res = await fetch(`${API_URL}/api/Task/UpdateTask`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(values),
    });

    const data = (await res.json()) as object;
    return data;
  },

  async createMcqQuestion(values: McqQuestion) {
    const token = await getUserToken();
    if (!token) {
      throw new Error("User not found");
    }

    const res = await fetch(`${API_URL}/api/Task/CreateMcqQuestions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(values),
    });

    if (!res.ok) {
      throw new Error("Failed to create mcq question");
    }

    const data = (await res.json()) as object;
    return data;
  },

  async createSubmissionQuestion(values: SubmissionQuestion) {
    const token = await getUserToken();
    if (!token) {
      throw new Error("User not found");
    }

    const res = await fetch(`${API_URL}/api/Task/CreateSubmissionQuestions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(values),
    });

    if (!res.ok) {
      throw new Error("Failed to create submission question");
    }

    const data = (await res.json()) as object;
    return data;
  },

  async submitMcqTask(
    values: {
      McqId: number;
      SelectedAnswer: string;
      IsCorrect: boolean;
    }[],
  ) {
    const token = await getUserToken();
    if (!token) {
      throw new Error("User not found");
    }

    const res = await fetch(`${API_URL}/api/Task/SolveMcqQuestions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(values),
    });

    if (!res.ok) {
      throw new Error("Failed to submit mcq task");
    }

    const data = (await res.json()) as object;
    return data;
  },

  async submitSubmissionTask(
    values: {
      SubmissionId: number;
      Text: string;
    }[],
  ) {
    const token = await getUserToken();
    if (!token) {
      throw new Error("User not found");
    }

    const formData = new FormData();
    values.forEach((value, index) => {
      formData.append(
        `submissionDTO[${index}].SubmissionId`,
        value.SubmissionId.toString(),
      );
      formData.append(`submissionDTO[${index}].Text`, value.Text);
    });

    const res = await fetch(`${API_URL}/api/Task/SolveSubmissionQuestions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    return res.ok;
  },

  async assignTaskToStudent(studentId: number, taskId: number) {
    const token = await getUserToken();
    if (!token) {
      throw new Error("User not found");
    }
    const res = await fetch(`${API_URL}/api/Task/AssignTask`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ StudentId: studentId, TasksId: taskId }),
    });

    if (!res.ok) {
      throw new Error("Failed to assign task to student");
    }

    const data = (await res.json()) as object;
    return data;
  },

  async unassignTaskFromStudent(studentId: number, taskId: number) {
    const token = await getUserToken();
    if (!token) {
      throw new Error("User not found");
    }

    const res = await fetch(`${API_URL}/api/Task/RemoveAssignedTask`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ StudentId: studentId, TasksId: taskId }),
    });

    if (!res.ok) {
      throw new Error("Failed to unassign task from student");
    }

    const data = (await res.json()) as object;
    return data;
  },

  async confirmTask(taskId: number) {
    const token = await getUserToken();
    if (!token) {
      throw new Error("User not found");
    }

    const res = await fetch(`${API_URL}/api/Task/ConfirmTask?id=${taskId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error("Failed to confirm task");
    }

    const data = (await res.json()) as object;
    return data;
  },
};
