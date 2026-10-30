import { DEMO_ACCOUNTS } from "./config";
import * as D from "./data";

/* Mutable in-memory copy of the dataset (per browser tab / server instance). */
const store = {
  mentors: D.mentors.map((m) => ({ ...m, plans: { ...m.plans } })),
  stages: D.roadmapStages.map((s) => ({ ...s })),
  pendingRequests: [...D.pendingRequestsToMentor],
  studentLinks: D.studentMentorLinks.map((l) => ({ ...l })),
  assignments: [...D.assignments],
  resources: D.resources.map((r) => ({ ...r })),
  resourceAssignments: [...D.resourceAssignments],
  tasks: [...D.tasks],
  taskQuestions: { ...D.taskQuestions },
  studentTasks: D.studentTasks.map((t) => ({ ...t })),
  chat: Object.fromEntries(
    Object.entries(D.chatHistory).map(([k, v]) => [k, [...v]]),
  ) as Record<string, D.DemoMessage[]>,
  applications: [...D.mentorApplications],
  payments: D.payments.map((p) => ({ ...p })),
  complaints: D.complaints.map((c) => ({ ...c })),
  nextId: 10_000,
};

type Role = "Student" | "Mentor" | "Admin";

const TOKENS: Record<string, Role> = {
  "demo-student-token": "Student",
  "demo-mentor-token": "Mentor",
  "demo-admin-token": "Admin",
};

/* ------------------------------------------------------------------ */
/* helpers                                                            */
/* ------------------------------------------------------------------ */

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

const text = (body: string, status = 200) =>
  new Response(body, { status, headers: { "Content-Type": "text/plain" } });

const mentorById = (id: number) => store.mentors.find((m) => m.id === id);
const studentById = (id: number) => D.students.find((s) => s.id === id);

function planOf(m: D.DemoMentor, title: string) {
  const t = title.toLowerCase();
  if (t.includes("roadmap")) return m.plans.roadmapPlan;
  if (t.includes("consult")) return m.plans.consultantPlan;
  return m.plans.customPlan;
}

function userFor(role: Role) {
  if (role === "Mentor") {
    const m = store.mentors[0]!;
    return {
      id: m.id,
      userId: m.userId,
      name: m.name,
      email: m.email,
      image: m.image,
      jobTitle: m.jobTitle,
      about: m.about,
      location: m.location,
      spotleft: m.spotleft,
      category: m.category,
      linkedin: m.linkedin,
      github: m.github,
      mentorPlans: {
        roadMapPlan: m.plans.roadmapPlan,
        customPlan: m.plans.customPlan,
        consultantPlan: m.plans.consultantPlan,
      },
      token: "demo-mentor-token",
      role: "Mentor",
    };
  }
  const base = role === "Admin" ? D.admin : D.MAIN_STUDENT;
  return {
    ...base,
    spotleft: 0,
    mentorPlans: null,
    token: role === "Admin" ? "demo-admin-token" : "demo-student-token",
    role,
  };
}

function roleFromHeaders(init?: RequestInit): Role | null {
  const headers = new Headers(init?.headers);
  const auth = headers.get("Authorization") ?? headers.get("authorization");
  if (!auth) return null;
  const token = auth.replace(/^Bearer\s+/i, "").trim();
  return TOKENS[token] ?? null;
}

function mentorListItem(m: D.DemoMentor) {
  return {
    id: m.id,
    name: m.name,
    userId: m.userId,
    email: m.email,
    image: m.image,
    jobTitle: m.jobTitle,
    about: m.about,
    location: m.location,
    spotleft: m.spotleft,
    category: m.category,
    linkedin: m.linkedin,
    github: m.github,
    role: "Mentor",
    averageRating: m.averageRating,
    mentorPlans: null,
  };
}

function paymentDto(p: D.DemoPayment) {
  const m = mentorById(p.mentorId)!;
  const plan = planOf(m, p.plan);
  return {
    id: p.id,
    amount: p.amount,
    userId: p.userId,
    userName: p.userName,
    mentorId: m.id,
    mentorName: m.name,
    roadmapPlanId: p.plan === "Roadmap" ? (plan?.id ?? 0) : 0,
    roadmapPlanTitle: p.plan === "Roadmap" ? "Roadmap" : "",
    customPlanId: p.plan === "Customized" ? (plan?.id ?? 0) : 0,
    customPlanTitle: p.plan === "Customized" ? "Customized" : "",
    consultantPlanId: p.plan === "Consultant" ? (plan?.id ?? 0) : 0,
    consultantPlanTitle: p.plan === "Consultant" ? "Consultant" : "",
    senderAccount: p.senderAccount,
    resevationAccount: m.accountBank,
    notes: p.notes,
    image: D.paymentReceipt,
    imagePath: D.paymentReceipt,
    requestDate: D.daysAgo(p.requestDay, 13),
    acceptationOrRejectionDate:
      p.decisionDay === null ? "" : D.daysAgo(p.decisionDay, 11),
    status: p.status,
  };
}

function complaintDto(c: (typeof store.complaints)[number]) {
  return {
    id: c.id,
    content: c.content,
    createdAt: D.daysAgo(c.day, 15),
    notes: c.notes,
    reasonOfRejection: c.reason,
    resonOfRejection: c.reason,
    status: c.status,
    userId: c.userId,
    userName: c.userName,
  };
}

function studentStagesFor(studentId: number) {
  const current = D.studentStageProgress[studentId] ?? 1;
  return D.roadmapStages.map((s) => ({
    ...s,
    status: (s.order < current
      ? "Completed"
      : s.order === current
        ? "Started"
        : "NotStarted") as D.StageStatus,
  }));
}

function addReply(assignmentId: number, fromRole: Role) {
  const thread = (store.chat[assignmentId] ??= []);
  const last = thread[thread.length - 1];
  if (!last) return;
  const pool =
    fromRole === "Student" ? D.mentorAutoReplies : D.studentAutoReplies;
  thread.push({
    id: ++store.nextId,
    senderUserId: last.receiverUserId,
    receiverUserId: last.senderUserId,
    message: pool[thread.length % pool.length]!,
    sentAt: new Date().toISOString(),
    studentMentorId: assignmentId,
  });
}

/** Used by the demo chat connection to post a message and schedule a reply. */
export function demoSendChatMessage(
  assignmentId: number,
  message: string,
  role: Role,
) {
  const thread = (store.chat[assignmentId] ??= []);
  const me = role === "Mentor" ? D.MAIN_MENTOR.userId : D.MAIN_STUDENT.userId;
  let other: string;
  if (role === "Mentor") {
    const a = store.assignments.find((x) => x.id === assignmentId);
    other = studentById(a?.studentId ?? 101)?.userId ?? "";
  } else {
    const l = store.studentLinks.find((x) => x.assignmentId === assignmentId);
    other = mentorById(l?.mentorId ?? 1)?.userId ?? "";
  }
  thread.push({
    id: ++store.nextId,
    senderUserId: me,
    receiverUserId: other,
    message,
    sentAt: new Date().toISOString(),
    studentMentorId: assignmentId,
  });
  return { reply: () => addReply(assignmentId, role) };
}

async function readBody(init?: RequestInit): Promise<Record<string, string>> {
  const body = init?.body;
  if (!body) return {};
  if (typeof body === "string") {
    try {
      const parsed = JSON.parse(body) as Record<string, unknown>;
      return Object.fromEntries(
        Object.entries(parsed).map(([k, v]) => [
          k,
          typeof v === "string" ? v : JSON.stringify(v),
        ]),
      );
    } catch {
      return {};
    }
  }
  if (typeof FormData !== "undefined" && body instanceof FormData) {
    const out: Record<string, string> = {};
    body.forEach((v, k) => {
      out[k] = typeof v === "string" ? v : v.name;
    });
    return out;
  }
  return {};
}

/* ------------------------------------------------------------------ */
/* router                                                             */
/* ------------------------------------------------------------------ */

export async function handleDemoRequest(
  url: URL,
  init?: RequestInit,
): Promise<Response> {
  const path = url.pathname.replace(/\/+$/, "").toLowerCase();
  const q = (k: string) => {
    for (const [key, value] of url.searchParams) {
      if (key.toLowerCase() === k.toLowerCase()) return value;
    }
    return null;
  };
  const role = roleFromHeaders(init);
  const seg = path.split("/").filter(Boolean); // ["api", "controller", ...]

  /* ---------- Account ---------- */
  if (path === "/api/account/login") {
    const body = await readBody(init);
    const email = (body.Email ?? body.email ?? "").toLowerCase();
    const r: Role = email.includes("admin")
      ? "Admin"
      : email.includes("mentor") && !email.includes("student")
        ? "Mentor"
        : "Student";
    return json(userFor(r));
  }
  if (path === "/api/account/registerstudent") return json(userFor("Student"));
  if (path === "/api/account/registermentor")
    return text(
      "Your application was received. An admin will review it shortly.",
    );
  if (path === "/api/account/getcurrentuser") {
    if (!role) return json({ message: "Unauthorized" }, 401);
    return json(userFor(role));
  }
  if (path === "/api/account/emailexist") {
    const email = (q("Email") ?? "").toLowerCase();
    return json(Object.values(DEMO_ACCOUNTS).some((a) => a.email === email));
  }
  if (path === "/api/account/sendemail") return text("Email sent");
  if (path === "/api/account/resetpassword")
    return text("Password reset successfully");
  if (
    path === "/api/account/updatestudentprofile" ||
    path === "/api/account/updatementorprofile"
  )
    return json({ message: "Profile updated successfully" });
  if (path === "/api/account/getmentorrequests")
    return json(
      store.applications.map(
        ({ id, name, email, image, jobTitle, category }) => ({
          id,
          name,
          email,
          image,
          jobTitle,
          category,
        }),
      ),
    );
  if (path === "/api/account/getmentorrequest") {
    const a = store.applications.find((x) => x.id === Number(q("id")));
    return a ? json(a) : json({ message: "Not found" }, 404);
  }
  if (
    path === "/api/account/acceptmentor" ||
    path === "/api/account/rejectmentor"
  ) {
    const id = Number(q("mentorRequestId"));
    store.applications = store.applications.filter((x) => x.id !== id);
    return json({
      message: path.endsWith("acceptmentor")
        ? "Mentor accepted"
        : "Mentor request rejected",
    });
  }

  /* ---------- Mentors ---------- */
  if (path === "/api/mentor") {
    const data = store.mentors.map(mentorListItem);
    return json({
      count: data.length,
      data,
      pageIndex: 1,
      pageSize: Number(q("PageSize") ?? data.length),
    });
  }
  if (path === "/api/mentor/mentor") {
    const m = mentorById(Number(q("id")));
    if (!m) return json({ message: "Not found" }, 404);
    return json({
      ...mentorListItem(m),
      mentorPlans: {
        roadmapPlan: m.plans.roadmapPlan,
        customPlan: m.plans.customPlan,
        consultantPlan: m.plans.consultantPlan,
      },
      token: null,
    });
  }
  if (path === "/api/mentor/mentorplans") {
    const m = store.mentors[0]!;
    const list = [
      m.plans.roadmapPlan,
      m.plans.customPlan,
      m.plans.consultantPlan,
    ]
      .filter(Boolean)
      .map((p) => ({
        ...p!,
        title: p!.title === "Customized" ? "Custom" : p!.title,
      }));
    return json({ mentorId: m.id, plansList: list });
  }
  if (path === "/api/mentor/getstudentassignedtomentor") {
    return json(
      store.assignments.map((a) => ({
        studentMentorId: a.id,
        mentorId: D.MAIN_MENTOR.id,
        stundetId: a.studentId,
        studentName: studentById(a.studentId)?.name ?? "Student",
        planTitle: a.planTitle,
        startDate: D.daysAgo(a.start),
        endDate: D.daysAgo(a.end),
      })),
    );
  }
  if (path === "/api/mentor/getresourceformentor")
    return json(
      store.resources.map(({ id, title, description }) => ({
        id,
        title,
        description,
      })),
    );
  if (path === "/api/mentor/getalltasksformentor") return json(store.tasks);

  /* ---------- Requests ---------- */
  if (path === "/api/request/getstudentrequesttomentor")
    return json(store.pendingRequests);
  if (path === "/api/request/acceptedrequestofstudent") {
    return json(
      store.studentLinks.map((l) => ({
        goal: l.goal,
        mentorName: mentorById(l.mentorId)?.name ?? "",
        planTitle: l.planTitle,
        status: l.status,
      })),
    );
  }
  if (path === "/api/request/studentrequest") {
    const body = await readBody(init);
    const mentorId = Number(body.MentorId ?? body.mentorId ?? 0);
    if (mentorId && !store.studentLinks.some((l) => l.mentorId === mentorId)) {
      store.studentLinks.push({
        assignmentId: ++store.nextId,
        mentorId,
        planTitle: body.PlanTitle ?? "Customized",
        goal: body.Goal ?? "",
        status: "pending",
        start: 0,
        end: -30,
      });
    }
    return json({ success: true, message: "Request sent to the mentor" });
  }
  if (
    path === "/api/request/acceptrequest" ||
    path === "/api/request/rejectrequest"
  ) {
    const id = Number(q("RequestId"));
    const req = store.pendingRequests.find((r) => r.id === id);
    store.pendingRequests = store.pendingRequests.filter((r) => r.id !== id);
    return json({
      message:
        path.endsWith("acceptrequest") && req
          ? `${req.studentName} is now your student`
          : "Request rejected",
    });
  }

  /* ---------- Plans and roadmap ---------- */
  if (path === "/api/plan/studentstages") {
    const mentor = D.MAIN_MENTOR;
    return json({
      roadmaps: [
        {
          roadmap: {
            id: mentor.plans.roadmapPlan!.id,
            title: "Frontend Developer Roadmap",
            description:
              "From HTML and CSS to shipping a Next.js app. Each stage ends with a small project reviewed by your mentor.",
            duration: mentor.plans.roadmapPlan!.duration,
            mentorName: mentor.name,
          },
          stages: store.stages.map((s) => ({
            ...s,
            roadmapPlanId: mentor.plans.roadmapPlan!.id,
          })),
        },
      ],
    });
  }
  if (path === "/api/plan/roadmapplanwithresources") {
    return json({
      id: D.MAIN_MENTOR.plans.roadmapPlan!.id,
      title: "Frontend Developer Roadmap",
      stages: store.stages,
    });
  }
  if (path === "/api/plan/roadmapplan") return text("Roadmap plan saved");
  if (path === "/api/plan/customplan" || path === "/api/plan/consultantplan") {
    const m = store.mentors[0]!;
    const isCustom = path.endsWith("customplan");
    const plan = {
      id: ++store.nextId,
      title: isCustom ? "Customized" : "Consultant",
      description: q("Description") ?? "",
      duration: q("Duration") ?? "",
      price: Number(q("Price") ?? 0),
    };
    if (isCustom) m.plans.customPlan = plan;
    else m.plans.consultantPlan = plan;
    return json({ message: "Plan saved", plan });
  }
  if (path === "/api/plan/deleteplan") {
    const m = store.mentors[0]!;
    const t = (q("planType") ?? "").toLowerCase();
    if (t.includes("road")) m.plans.roadmapPlan = null;
    else if (t.includes("consult")) m.plans.consultantPlan = null;
    else m.plans.customPlan = null;
    return text("Plan deleted");
  }

  /* ---------- Student progress ---------- */
  if (
    path === "/api/student/startstage" ||
    path === "/api/student/completestage"
  ) {
    const id = Number(q("stageId"));
    const s = store.stages.find((x) => x.id === id);
    if (s) s.status = path.endsWith("startstage") ? "Started" : "Completed";
    return text(
      path.endsWith("startstage") ? "Stage started" : "Stage completed",
    );
  }
  if (path === "/api/student/progress") {
    const s =
      store.stages.find((x) => x.id === Number(q("StageId"))) ??
      store.stages[3]!;
    return json({
      id: s.id,
      name: s.title,
      description: s.description,
      createdAt: D.daysAgo(10),
      updatedAt: D.daysAgo(1),
    });
  }

  /* ---------- Reports ---------- */
  if (path === "/api/reports/mentorcurrentstages") {
    return json(
      store.assignments.map((a) => {
        const stages = studentStagesFor(a.studentId);
        const current =
          stages.find((s) => s.status === "Started") ?? stages[0]!;
        return {
          studentId: String(a.studentId),
          roadmapStages: stages.map((s) => ({
            stageId: s.order,
            title: s.title,
            order: s.order,
          })),
          currentStageId: current.order,
          currentStageTitle: current.title,
        };
      }),
    );
  }
  if (path === "/api/reports/mentorstrugglestages") {
    return json(
      D.struggles.map((s) => {
        const stage = D.roadmapStages.find((x) => x.order === s.stageOrder)!;
        return {
          studentId: String(s.studentId),
          stageId: stage.id,
          stageTitle: stage.title,
          timeSpent: s.timeSpent,
          expectedDuration: s.expectedDuration,
          timeOverdue: s.timeOverdue,
        };
      }),
    );
  }
  if (path === "/api/reports/weeklyactivetime") {
    const days = ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"];
    const minutes = [95, 140, 60, 180, 120, 75, 30];
    return json(days.map((day, i) => ({ day, minutes: minutes[i] })));
  }

  /* ---------- Resources ---------- */
  if (path === "/api/resources/getresource") {
    const r = store.resources.find((x) => x.id === Number(q("id")));
    return r ? json(r) : json({ statusCode: 404, message: "Not found" }, 404);
  }
  if (path === "/api/resources/getstudentresources") {
    const ids = store.resourceAssignments
      .filter((a) => a.studentId === D.MAIN_STUDENT.id)
      .map((a) => a.resourceId);
    return json(store.resources.filter((r) => ids.includes(r.id)));
  }
  if (path === "/api/resources/getmentorassignedresources") {
    return json(
      store.resourceAssignments.map((a) => {
        const r = store.resources.find((x) => x.id === a.resourceId)!;
        return {
          resourceId: r.id,
          resourceTitle: r.title,
          resourceDescription: r.description,
          studentId: a.studentId,
          studentName: studentById(a.studentId)?.name ?? "",
          files: r.files,
          urls: r.urls,
        };
      }),
    );
  }
  if (path === "/api/resources/createresource") {
    const body = await readBody(init);
    const id = ++store.nextId;
    store.resources.push({
      id,
      title: body.Title ?? body.title ?? "New resource",
      description: body.Description ?? body.description ?? "",
      urls: [],
      files: [],
    });
    return text(`Resource Created Successfully ${id}`);
  }
  if (path === "/api/resources/updateresource") {
    const body = await readBody(init);
    const id = Number(body.Id ?? body.id ?? 0);
    const r = store.resources.find((x) => x.id === id);
    if (r) {
      r.title = body.Title ?? body.title ?? r.title;
      r.description = body.Description ?? body.description ?? r.description;
    }
    return text(`Resource Updated Successfully ${id}`);
  }
  if (path === "/api/resources/deleteresource") {
    const id = Number(q("Id"));
    store.resources = store.resources.filter((r) => r.id !== id);
    return text("Resource deleted");
  }
  if (path === "/api/resources/assignresourcetostudent") {
    const body = await readBody(init);
    store.resourceAssignments.push({
      resourceId: Number(body.ResourceId ?? body.resourceId ?? 0),
      studentId: Number(body.StudentId ?? body.studentId ?? 0),
    });
    return json({ message: "Resource assigned" });
  }
  if (path === "/api/resources/removeresourcefromstudent") {
    const body = await readBody(init);
    const rid = Number(body.ResourceId ?? body.resourceId ?? 0);
    const sid = Number(body.StudentId ?? body.studentId ?? 0);
    store.resourceAssignments = store.resourceAssignments.filter(
      (a) => !(a.resourceId === rid && a.studentId === sid),
    );
    return json({ message: "Resource removed" });
  }

  /* ---------- Tasks ---------- */
  if (path === "/api/task/studenttasks") {
    return json(
      store.studentTasks
        .filter((t) => t.studentId === D.MAIN_STUDENT.id)
        .map((t) => ({
          id: t.id,
          tasksId: t.tasksId,
          taskTitle:
            store.tasks.find((x) => x.id === t.tasksId)?.title ?? "Task",
          mentorId: D.MAIN_MENTOR.id,
          mentorName: D.MAIN_MENTOR.name,
          finalScore: t.finalScore,
          submittedOn: t.submittedOn,
        })),
    );
  }
  if (path === "/api/task/mentortasks") {
    const sid = Number(q("studentId"));
    return json(
      store.studentTasks
        .filter((t) => t.studentId === sid)
        .map((t) => ({
          id: t.id,
          tasksId: t.tasksId,
          taskTitle:
            store.tasks.find((x) => x.id === t.tasksId)?.title ?? "Task",
          studentId: sid,
          studentName: studentById(sid)?.name ?? "",
          finalScore: t.finalScore,
          submittedOn: t.submittedOn,
        })),
    );
  }
  if (path === "/api/task/taskbyid")
    return json(store.taskQuestions[Number(q("Id"))] ?? []);
  if (path === "/api/task/taskdetails") {
    const body = await readBody(init);
    const taskId = Number(body.tasksId ?? body.TasksId ?? 0);
    const task = store.tasks.find((t) => t.id === taskId);
    const st = store.studentTasks.find(
      (t) => t.tasksId === taskId && t.studentId === D.MAIN_STUDENT.id,
    );
    const questions = store.taskQuestions[taskId] ?? [];
    const answers = D.completedAnswers[taskId];
    if (st?.completed && answers) {
      return json({
        isCompleted: true,
        studentTasksId: st.id,
        tasksId: taskId,
        taskTitle: task?.title ?? "",
        mcqQuestions: questions.filter((x) => x.options),
        submissionQuestions: questions.filter((x) => !x.options),
        mcqAnswers: answers.mcq,
        submissionAnswers: answers.submission,
      });
    }
    return json({
      isCompleted: false,
      studentTasksId: st?.id ?? 0,
      tasksId: taskId,
      taskTitle: task?.title ?? "",
      mcqQuestions: questions.filter((x) => x.options),
      submissionQuestions: questions.filter((x) => !x.options),
      mcqAnswers: null,
      submissionAnswers: null,
    });
  }
  if (path === "/api/task/createtask") {
    const body = await readBody(init);
    const taskType: "Mcq" | "Submission" =
      (body.TaskType ?? body.taskType) === "Submission" ? "Submission" : "Mcq";
    const t = {
      id: ++store.nextId,
      title: body.Title ?? body.title ?? "New task",
      taskType,
    };
    store.tasks.push(t);
    store.taskQuestions[t.id] = [];
    return json(t);
  }
  if (
    path === "/api/task/solvemcqquestions" ||
    path === "/api/task/solvesubmissionquestions"
  ) {
    return json({ message: "Answers submitted", score: 75 });
  }
  if (path.startsWith("/api/task/")) return json({ message: "Done" });

  /* ---------- Chat ---------- */
  if (path === "/api/chat/assigned-students") {
    return json(
      store.assignments.map((a) => ({
        id: a.id,
        name: studentById(a.studentId)?.name ?? "",
      })),
    );
  }
  if (path === "/api/chat/assignments") {
    if (role === "Mentor") {
      return json(
        store.assignments.map((a) => {
          const s = studentById(a.studentId)!;
          return {
            id: a.id,
            name: s.name,
            image: s.image,
            planTitle: a.planTitle,
            startDate: D.daysAgo(a.start),
            endDate: D.daysAgo(a.end),
          };
        }),
      );
    }
    return json(
      store.studentLinks
        .filter((l) => l.status === "Accepted")
        .map((l) => {
          const m = mentorById(l.mentorId)!;
          return {
            id: l.assignmentId,
            name: m.name,
            image: m.image,
            planTitle: l.planTitle,
            startDate: D.daysAgo(l.start),
            endDate: D.daysAgo(l.end),
          };
        }),
    );
  }
  if (seg[0] === "api" && seg[1] === "chat" && seg[2] === "history") {
    return json(store.chat[seg[3] ?? ""] ?? []);
  }

  /* ---------- Payments ---------- */
  if (path === "/api/manualpayment/paymentrequests") {
    return json(
      store.payments.filter((p) => p.status === "Pending").map(paymentDto),
    );
  }
  if (path === "/api/manualpayment/archivedmanualpaymentrequests") {
    return json(
      store.payments.filter((p) => p.status !== "Pending").map(paymentDto),
    );
  }
  if (path === "/api/manualpayment/paymentrequest") {
    const p = store.payments.find((x) => x.id === Number(q("id")));
    return p ? json(paymentDto(p)) : json({ message: "Not found" }, 404);
  }
  if (
    seg[1] === "manualpayment" &&
    seg[2] === "paymentrequests" &&
    seg[4] === "accept"
  ) {
    const p = store.payments.find((x) => x.id === Number(seg[3]));
    if (p) {
      p.status = "Accepted";
      p.decisionDay = 0;
    }
    return json({ message: "Payment accepted" });
  }
  if (seg[1] === "manualpayment" && seg[2] === "rejectmanualpaymentrequest") {
    const p = store.payments.find((x) => x.id === Number(seg[3]));
    if (p) {
      p.status = "Rejected";
      p.decisionDay = 0;
    }
    return json({ message: "Payment rejected" });
  }
  if (path === "/api/manualpayment/createpaymentrequest")
    return json({ message: "Payment request sent" });
  if (path === "/api/payment/createpaypalrequest") {
    return json({
      url: "/student-dashboard/payment-requests/confirm?token=DEMO-ORDER",
    });
  }
  if (path === "/api/payment/capture") {
    return json({
      statusCode: 200,
      reportMessage: "Payment completed successfully (demo)",
    });
  }

  /* ---------- Complaints ---------- */
  if (path === "/api/complaints/getalladmincomplaints")
    return json(store.complaints.map(complaintDto));
  if (seg[1] === "complaints" && seg[2] === "getallusercomplaints") {
    const uid = seg[3]
      ? decodeURIComponent(url.pathname.split("/").filter(Boolean)[3] ?? "")
      : "";
    return json(
      store.complaints.filter((c) => c.userId === uid).map(complaintDto),
    );
  }
  if (path === "/api/complaints/createcomplaint") {
    const body = await readBody(init);
    const user = userFor(role ?? "Student");
    const c = {
      id: ++store.nextId,
      userId: user.userId,
      userName: user.name,
      content: body.Content ?? body.content ?? "",
      notes: "",
      reason: "",
      status: "Pending" as const,
      day: 0,
    };
    store.complaints.unshift(c);
    return json(complaintDto(c));
  }
  if (
    seg[1] === "complaints" &&
    ["acceptcomplaint", "rejectcomplaint", "deletecomplaint"].includes(
      seg[2] ?? "",
    )
  ) {
    const id = Number(seg[3]);
    const body = await readBody(init);
    const c = store.complaints.find((x) => x.id === id);
    if (seg[2] === "deletecomplaint")
      store.complaints = store.complaints.filter((x) => x.id !== id);
    else if (c) {
      c.status = seg[2] === "acceptcomplaint" ? "Resolved" : "Rejected";
      c.notes = body.notes ?? body.Notes ?? c.notes;
      c.reason =
        body.reasonOfRejection ??
        body.ReasonOfRejection ??
        body.reason ??
        c.reason;
    }
    return json({ message: "Complaint updated" });
  }

  return json({ message: "Done" });
}
