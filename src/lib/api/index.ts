import { tasksQueries } from "./queries/tasks";
import { resourcesQueries } from "./queries/resources";
import { chatQueries } from "./queries/chat";
import { tasksMutations } from "./mutations/tasks";
import { resourcesMutations } from "./mutations/resources";
import { plansMutations } from "./mutations/plans";
import { mentorsQueries } from "./queries/mentors";
import { plansQueries } from "./queries/plan";
import { reportQueries } from "./queries/reports";
import { mentorMutations } from "./mutations/mentor";
import { requestsMutations } from "./mutations/requests";
import { adminQueries } from "./queries/admin";
import { adminMutations } from "./mutations/admin";
import { requestsQueries } from "./queries/requests";
import { paymentsMutations } from "./mutations/payments";
import { complaintsMutations } from "./mutations/complaints";
import { complaintsQuery } from "./queries/complaints";
import { roadmapQueries } from "./queries/roadmap";
import { roadmapMutations } from "./mutations/roadmap";
import { studentsQueries } from "./queries/students";
import { accountMutations } from "./mutations/account";
import { progressQueries } from "./queries/progress";

export const API = {
  queries: {
    // Tasks
    tasks: tasksQueries,

    // Resources
    resources: resourcesQueries,

    // Chat
    chat: chatQueries,

    // Mentors
    mentors: mentorsQueries,

    // Plans
    plans: plansQueries,

    // Reports
    reports: reportQueries,

    // Admin
    admin: adminQueries,

    // Requests
    requests: requestsQueries,

    // Complaints
    complaints: complaintsQuery,

    // Roadmap
    roadmap: roadmapQueries,

    // Students
    students: studentsQueries,

    // Progress
    progress: progressQueries,
  },

  mutations: {
    // Tasks
    tasks: tasksMutations,

    // Resources
    resources: resourcesMutations,

    // Plans
    plans: plansMutations,

    // Mentors
    mentors: mentorMutations,

    // Requests
    requests: requestsMutations,

    // Payments
    payments: paymentsMutations,

    // Admin
    admin: adminMutations,

    // Complaints
    complaints: complaintsMutations,

    // Roadmap
    roadmap: roadmapMutations,

    // Account
    account: accountMutations,
  },
};
