export interface Task {
  id: number;
  title: string;
  taskType: "Mcq" | "Submission";
}

export interface TaskQuestion {
  id: number;
  question: string;
  options?: string[];
  score: number;
  correctAnswer: string;
  taskId: number;
}

export type McqQuestion = {
  TaskId: number;
  Question: string;
  Score: number;
  Options: string[];
  CorrectAnswer: string;
};

export type SubmissionQuestion = {
  TaskId: number;
  Question: string;
  Score: number;
};
