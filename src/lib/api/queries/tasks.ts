import { API_URL } from "@/lib/constants";
import type { Task, TaskQuestion } from "@/lib/types/tasks";
import { getCurrentUser } from "@/server/actions/auth";

export const tasksQueries = {
  async getMentorTasks() {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error("User not authorized");
    }

    const res = await fetch(`${API_URL}/api/Mentor/GetAllTasksForMentor`, {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });

    const data = (await res.json()) as Task[];
    return data;
  },

  async getStudentTasks() {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error("User not authorized");
    }

    const res = await fetch(`${API_URL}/api/Task/StudentTasks`, {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });

    const data = (await res.json()) as {
      finalScore: number;
      id: number;
      mentorId: number;
      mentorName: string;
      submittedOn: string;
      taskTitle: string;
      tasksId: number;
    }[];

    return data;
  },

  async getTaskById(id: number) {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error("User not authorized");
    }

    const tasks = await this.getMentorTasks();
    if (!tasks) {
      return null;
    }

    const task = tasks.find((task) => (task.id = id));
    return task;
  },

  async getTaskDetails(taskId: number) {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error("User not authorized");
    }

    console.log("[userId]", user.id);
    console.log("[taskId]", taskId);

    const res = await fetch(`${API_URL}/api/Task/TaskDetails`, {
      headers: {
        Authorization: `Bearer ${user.token}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        studentId: user.id,
        tasksId: taskId,
      }),
    });

    const data = (await res.json()) as
      | {
          isCompleted: false;
          mcqAnswers: null;
          mcqQuestions: TaskQuestion[];
          studentTasksId: number;
          submissionAnswers: null;
          submissionQuestions: TaskQuestion[];
          taskTitle: string;
          tasksId: number;
        }
      | {
          isCompleted: true;
          mcqAnswers: {
            mcqId: number;
            selectedAnswer: string;
            isCorrect: boolean;
          }[];
          mcqQuestions: null;
          studentTasksId: number;
          submissionAnswers: {
            submissionId: number;
            text: string;
          }[];
          submissionQuestions: null;
          taskTitle: string;
          tasksId: number;
        };

    return data;
  },

  async getTaskQuestions(taskId: number) {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error("User not authorized");
    }

    const res = await fetch(`${API_URL}/api/Task/TaskById?Id=${taskId}`, {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });

    const data = (await res.json()) as TaskQuestion[];
    return data;
  },

  async getAssignedTasksToStudent(studentId: number) {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error("User not authorized");
    }

    const res = await fetch(
      `${API_URL}/api/Task/MentorTasks?studentId=${studentId}`,
      {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      },
    );

    const data = (await res.json()) as {
      finalScore: number;
      id: number;
      studentId: number;
      studentName: string;
      submittedOn: string;
      taskTitle: string;
      tasksId: number;
    }[];

    return data;
  },
};
