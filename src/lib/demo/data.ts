/* Sample data used by demo mode. Dates are relative to "now" so the app always looks active. */

const DAY = 24 * 60 * 60 * 1000;
export const daysAgo = (n: number, hour = 10) => {
  const d = new Date(Date.now() - n * DAY);
  d.setHours(hour, (n * 7) % 60, 0, 0);
  return d.toISOString();
};
export const daysAhead = (n: number) => daysAgo(-n);

const avatar = (slug: string) => `/demo/avatars/${slug}.svg`;
const file = (name: string) => `/demo/files/${name}`;

/* ------------------------------------------------------------------ */
/* Plans                                                              */
/* ------------------------------------------------------------------ */

export type DemoPlan = {
  id: number;
  title: string;
  description: string;
  duration: string;
  price: number;
};

type PlanSet = {
  roadmapPlan: DemoPlan | null;
  customPlan: DemoPlan | null;
  consultantPlan: DemoPlan | null;
};

/* ------------------------------------------------------------------ */
/* Mentors                                                            */
/* ------------------------------------------------------------------ */

export type DemoMentor = {
  id: number;
  userId: string;
  name: string;
  email: string;
  image: string;
  jobTitle: string;
  category: string;
  location: string;
  about: string;
  spotleft: number;
  linkedin: string;
  github: string;
  averageRating: number;
  accountBank: string;
  plans: PlanSet;
};

let planId = 100;
const plans = (
  focus: string,
  roadmap: [string, number] | null,
  custom: [string, number] | null,
  consultant: [string, number] | null,
): PlanSet => ({
  roadmapPlan: roadmap && {
    id: ++planId,
    title: "Roadmap",
    description: `A structured, stage by stage roadmap to master ${focus}, with curated resources, checkpoints and weekly reviews.`,
    duration: roadmap[0],
    price: roadmap[1],
  },
  customPlan: custom && {
    id: ++planId,
    title: "Customized",
    description: `A plan built around your goal in ${focus}: tailored tasks, code or design reviews and 1:1 sessions every week.`,
    duration: custom[0],
    price: custom[1],
  },
  consultantPlan: consultant && {
    id: ++planId,
    title: "Consultant",
    description: `Focused consultation calls on ${focus}: career advice, portfolio and CV review, and interview preparation.`,
    duration: consultant[0],
    price: consultant[1],
  },
});

export const mentors: DemoMentor[] = [
  {
    id: 1,
    userId: "u-mentor-omar",
    name: "Omar Khaled",
    email: "mentor@mentoro.demo",
    image: avatar("omar-khaled"),
    jobTitle: "Senior Frontend Engineer",
    category: "Web Development",
    location: "Cairo, Egypt",
    about:
      "Frontend engineer with 8 years of experience building large React and Next.js applications for fintech and e-commerce teams. I have interviewed more than 100 candidates and mentored 40+ juniors into their first frontend role. My sessions focus on clean component design, performance, and the habits that make you a reliable teammate.",
    spotleft: 3,
    linkedin: "linkedin.com/in/omar-khaled-demo",
    github: "github.com/omar-khaled-demo",
    averageRating: 4.9,
    accountBank: "omar.khaled@instapay",
    plans: plans(
      "frontend development",
      ["3 Months", 1500],
      ["6 Weeks", 2200],
      ["4 Sessions", 900],
    ),
  },
  {
    id: 2,
    userId: "u-mentor-salma",
    name: "Salma Adel",
    email: "salma.adel@mentoro.demo",
    image: avatar("salma-adel"),
    jobTitle: "Lead UI/UX Designer",
    category: "Web Development",
    location: "Alexandria, Egypt",
    about:
      "Product designer leading design for a health tech startup. I help mentees go from tutorials to real case studies: user research, wireframes, design systems in Figma and handoff that developers love. Expect honest portfolio reviews and practical exercises.",
    spotleft: 2,
    linkedin: "linkedin.com/in/salma-adel-demo",
    github: "github.com/salma-adel-demo",
    averageRating: 4.8,
    accountBank: "salma.adel@instapay",
    plans: plans(
      "UI/UX design",
      ["10 Weeks", 1300],
      ["4 Weeks", 1800],
      ["3 Sessions", 700],
    ),
  },
  {
    id: 3,
    userId: "u-mentor-youssef",
    name: "Youssef Mansour",
    email: "youssef.mansour@mentoro.demo",
    image: avatar("youssef-mansour"),
    jobTitle: "Backend Engineer (.NET)",
    category: "Enterprise Software Development",
    location: "Alexandria, Egypt",
    about:
      "Backend engineer building ASP.NET Core APIs for enterprise clients across the Gulf. I teach C#, clean architecture, Entity Framework and SQL Server through small real projects, plus the debugging and testing habits that matter in production.",
    spotleft: 4,
    linkedin: "linkedin.com/in/youssef-mansour-demo",
    github: "github.com/youssef-mansour-demo",
    averageRating: 4.7,
    accountBank: "youssef.mansour@instapay",
    plans: plans(
      "backend development with .NET",
      ["4 Months", 1800],
      ["8 Weeks", 2400],
      null,
    ),
  },
  {
    id: 4,
    userId: "u-mentor-laila",
    name: "Laila Farouk",
    email: "laila.farouk@mentoro.demo",
    image: avatar("laila-farouk"),
    jobTitle: "Data Scientist",
    category: "Data Science and Machine Learning Development",
    location: "Berlin, Germany",
    about:
      "Data scientist working on forecasting and recommendation systems. I guide mentees through Python, pandas, statistics and machine learning, then help them publish two portfolio projects that hiring managers actually read.",
    spotleft: 1,
    linkedin: "linkedin.com/in/laila-farouk-demo",
    github: "github.com/laila-farouk-demo",
    averageRating: 4.9,
    accountBank: "laila.farouk@instapay",
    plans: plans(
      "data science",
      ["4 Months", 2000],
      ["6 Weeks", 2600],
      ["4 Sessions", 1100],
    ),
  },
  {
    id: 5,
    userId: "u-mentor-karim",
    name: "Karim Nabil",
    email: "karim.nabil@mentoro.demo",
    image: avatar("karim-nabil"),
    jobTitle: "Flutter Developer",
    category: "Mobile App Development",
    location: "Dubai, UAE",
    about:
      "Mobile developer who has shipped 12 Flutter apps to the App Store and Google Play. I cover Dart, state management with Riverpod and Bloc, Firebase, and the publishing checklist so your first app actually goes live.",
    spotleft: 5,
    linkedin: "linkedin.com/in/karim-nabil-demo",
    github: "github.com/karim-nabil-demo",
    averageRating: 4.6,
    accountBank: "karim.nabil@instapay",
    plans: plans(
      "Flutter app development",
      ["3 Months", 1600],
      ["5 Weeks", 2000],
      ["3 Sessions", 750],
    ),
  },
  {
    id: 6,
    userId: "u-mentor-hana",
    name: "Hana Mostafa",
    email: "hana.mostafa@mentoro.demo",
    image: avatar("hana-mostafa"),
    jobTitle: "Machine Learning Engineer",
    category: "Artificial Intelligence",
    location: "Alexandria, Egypt",
    about:
      "ML engineer focused on computer vision and LLM applications. Together we will train, evaluate and deploy models, read papers without getting lost, and build an AI project you can demo in interviews.",
    spotleft: 2,
    linkedin: "linkedin.com/in/hana-mostafa-demo",
    github: "github.com/hana-mostafa-demo",
    averageRating: 4.8,
    accountBank: "hana.mostafa@instapay",
    plans: plans(
      "AI and machine learning",
      ["5 Months", 2300],
      ["8 Weeks", 2900],
      ["4 Sessions", 1200],
    ),
  },
  {
    id: 7,
    userId: "u-mentor-ahmed",
    name: "Ahmed Samir",
    email: "ahmed.samir@mentoro.demo",
    image: avatar("ahmed-samir"),
    jobTitle: "DevOps Engineer",
    category: "DevOps and Infrastructure Development",
    location: "Cairo, Egypt",
    about:
      "DevOps engineer running Kubernetes clusters for a telecom company. I teach Linux, Docker, CI/CD pipelines and monitoring with hands-on labs, and I help you prepare for your first cloud certification.",
    spotleft: 3,
    linkedin: "linkedin.com/in/ahmed-samir-demo",
    github: "github.com/ahmed-samir-demo",
    averageRating: 4.5,
    accountBank: "ahmed.samir@instapay",
    plans: plans("DevOps", ["3 Months", 1700], null, ["3 Sessions", 800]),
  },
  {
    id: 8,
    userId: "u-mentor-mariam",
    name: "Mariam Ezzat",
    email: "mariam.ezzat@mentoro.demo",
    image: avatar("mariam-ezzat"),
    jobTitle: "Cloud Solutions Architect",
    category: "Cloud Development",
    location: "Riyadh, Saudi Arabia",
    about:
      "AWS certified architect designing scalable systems for retail and logistics. Sessions cover cloud fundamentals, serverless, cost optimization and system design interviews.",
    spotleft: 2,
    linkedin: "linkedin.com/in/mariam-ezzat-demo",
    github: "github.com/mariam-ezzat-demo",
    averageRating: 4.7,
    accountBank: "mariam.ezzat@instapay",
    plans: plans(
      "cloud architecture",
      ["3 Months", 1900],
      ["6 Weeks", 2500],
      ["4 Sessions", 1000],
    ),
  },
  {
    id: 9,
    userId: "u-mentor-tarek",
    name: "Tarek Fawzy",
    email: "tarek.fawzy@mentoro.demo",
    image: avatar("tarek-fawzy"),
    jobTitle: "Game Developer (Unity)",
    category: "Game Development",
    location: "Giza, Egypt",
    about:
      "Indie game developer with two published titles on Steam. I mentor beginners through C#, Unity physics, game feel and shipping a small but polished game from scratch.",
    spotleft: 4,
    linkedin: "linkedin.com/in/tarek-fawzy-demo",
    github: "github.com/tarek-fawzy-demo",
    averageRating: 4.6,
    accountBank: "tarek.fawzy@instapay",
    plans: plans(
      "game development with Unity",
      ["4 Months", 1500],
      ["6 Weeks", 1900],
      null,
    ),
  },
  {
    id: 10,
    userId: "u-mentor-nadine",
    name: "Nadine Saleh",
    email: "nadine.saleh@mentoro.demo",
    image: avatar("nadine-saleh"),
    jobTitle: "Application Security Engineer",
    category: "Security Software Development",
    location: "Amsterdam, Netherlands",
    about:
      "Security engineer doing code reviews and penetration tests for SaaS companies. I teach secure coding, the OWASP Top 10, and how to start in cybersecurity through CTFs and bug bounties.",
    spotleft: 1,
    linkedin: "linkedin.com/in/nadine-saleh-demo",
    github: "github.com/nadine-saleh-demo",
    averageRating: 4.9,
    accountBank: "nadine.saleh@instapay",
    plans: plans("application security", ["3 Months", 2100], null, [
      "3 Sessions",
      1100,
    ]),
  },
  {
    id: 11,
    userId: "u-mentor-mostafa",
    name: "Mostafa Ali",
    email: "mostafa.ali@mentoro.demo",
    image: avatar("mostafa-ali"),
    jobTitle: "Embedded Systems Engineer",
    category: "Embedded Systems Development",
    location: "Alexandria, Egypt",
    about:
      "Embedded engineer working on automotive ECUs. I guide mentees through C, microcontrollers, RTOS basics and hardware debugging with low cost boards you can buy locally.",
    spotleft: 3,
    linkedin: "linkedin.com/in/mostafa-ali-demo",
    github: "github.com/mostafa-ali-demo",
    averageRating: 4.5,
    accountBank: "mostafa.ali@instapay",
    plans: plans(
      "embedded systems",
      ["4 Months", 1600],
      ["6 Weeks", 2100],
      null,
    ),
  },
  {
    id: 12,
    userId: "u-mentor-rana",
    name: "Rana Ibrahim",
    email: "rana.ibrahim@mentoro.demo",
    image: avatar("rana-ibrahim"),
    jobTitle: "Android Developer (Kotlin)",
    category: "Mobile App Development",
    location: "London, United Kingdom",
    about:
      "Android engineer at a fintech scale-up. I teach Kotlin, Jetpack Compose, clean architecture and testing, and review your app the way a senior teammate would.",
    spotleft: 2,
    linkedin: "linkedin.com/in/rana-ibrahim-demo",
    github: "github.com/rana-ibrahim-demo",
    averageRating: 4.8,
    accountBank: "rana.ibrahim@instapay",
    plans: plans(
      "Android development",
      ["3 Months", 1700],
      ["6 Weeks", 2300],
      ["3 Sessions", 850],
    ),
  },
];

export const MAIN_MENTOR = mentors[0]!;

/* ------------------------------------------------------------------ */
/* Students                                                           */
/* ------------------------------------------------------------------ */

export type DemoStudent = {
  id: number;
  userId: string;
  name: string;
  email: string;
  image: string;
  jobTitle: string;
  about: string;
  location: string;
  category: string;
  linkedin: string;
  github: string;
};

export const students: DemoStudent[] = [
  {
    id: 101,
    userId: "u-student-nour",
    name: "Nour Hassan",
    email: "student@mentoro.demo",
    image: avatar("nour-hassan"),
    jobTitle: "Computer Science Student",
    about:
      "Final year CS student who loves building interfaces. Learning React and Next.js to land my first frontend internship, and exploring UI/UX on the side.",
    location: "Alexandria, Egypt",
    category: "Web Development",
    linkedin: "linkedin.com/in/nour-hassan-demo",
    github: "github.com/nour-hassan-demo",
  },
  {
    id: 102,
    userId: "u-student-ziad",
    name: "Ziad Hamdy",
    email: "ziad.hamdy@mentoro.demo",
    image: avatar("ziad-hamdy"),
    jobTitle: "Junior Web Developer",
    about: "Self taught developer moving from WordPress to modern JavaScript.",
    location: "Cairo, Egypt",
    category: "Web Development",
    linkedin: "linkedin.com/in/ziad-hamdy-demo",
    github: "github.com/ziad-hamdy-demo",
  },
  {
    id: 103,
    userId: "u-student-farida",
    name: "Farida Yasser",
    email: "farida.yasser@mentoro.demo",
    image: avatar("farida-yasser"),
    jobTitle: "Information Systems Student",
    about:
      "Third year student preparing a frontend portfolio for summer internships.",
    location: "Mansoura, Egypt",
    category: "Web Development",
    linkedin: "linkedin.com/in/farida-yasser-demo",
    github: "github.com/farida-yasser-demo",
  },
  {
    id: 104,
    userId: "u-student-adam",
    name: "Adam Sherif",
    email: "adam.sherif@mentoro.demo",
    image: avatar("adam-sherif"),
    jobTitle: "Mechanical Engineer switching to tech",
    about: "Career switcher learning frontend development in the evenings.",
    location: "Giza, Egypt",
    category: "Web Development",
    linkedin: "linkedin.com/in/adam-sherif-demo",
    github: "github.com/adam-sherif-demo",
  },
  {
    id: 105,
    userId: "u-student-malak",
    name: "Malak Tamer",
    email: "malak.tamer@mentoro.demo",
    image: avatar("malak-tamer"),
    jobTitle: "Computer Engineering Student",
    about: "Interested in web performance and accessibility.",
    location: "Alexandria, Egypt",
    category: "Web Development",
    linkedin: "linkedin.com/in/malak-tamer-demo",
    github: "github.com/malak-tamer-demo",
  },
];

export const MAIN_STUDENT = students[0]!;

export const admin = {
  id: 900,
  userId: "u-admin",
  name: "Mentoro Admin",
  email: "admin@mentoro.demo",
  image: avatar("admin"),
  jobTitle: "Platform Administrator",
  about:
    "Keeps Mentoro running: reviews mentor applications, payments and complaints.",
  location: "Alexandria, Egypt",
  category: "",
  linkedin: "",
  github: "",
};

/* ------------------------------------------------------------------ */
/* Mentor and student relationships                                   */
/* ------------------------------------------------------------------ */

/** Students currently assigned to the main mentor (Omar). */
export const assignments = [
  { id: 501, studentId: 101, planTitle: "Roadmap", start: 34, end: -56 },
  { id: 502, studentId: 102, planTitle: "Customized", start: 20, end: -22 },
  { id: 503, studentId: 103, planTitle: "Roadmap", start: 48, end: -42 },
  { id: 504, studentId: 104, planTitle: "Consultant", start: 9, end: -19 },
  { id: 505, studentId: 105, planTitle: "Roadmap", start: 61, end: -29 },
];

/** Mentors the main student (Nour) works with, and her request states. */
export const studentMentorLinks = [
  {
    assignmentId: 501,
    mentorId: 1,
    planTitle: "Roadmap",
    goal: "Become job ready as a React frontend developer and land an internship by summer.",
    status: "Accepted",
    start: 34,
    end: -56,
  },
  {
    assignmentId: 511,
    mentorId: 2,
    planTitle: "Consultant",
    goal: "Get feedback on my UI/UX case studies and improve my Figma portfolio.",
    status: "Accepted",
    start: 12,
    end: -16,
  },
  {
    assignmentId: 512,
    mentorId: 6,
    planTitle: "Customized",
    goal: "Build a small AI feature (image captioning) for my graduation project.",
    status: "pending",
    start: 2,
    end: -40,
  },
];

/** New requests waiting for the main mentor. */
export const pendingRequestsToMentor = [
  {
    id: 701,
    studentName: "Youssef Adel",
    planTitle: "Roadmap",
    goal: "I know HTML and CSS well and want a clear path to React and Next.js in three months.",
  },
  {
    id: 702,
    studentName: "Jana Mahmoud",
    planTitle: "Customized",
    goal: "Review my e-commerce project and help me refactor it with TypeScript and React Query.",
  },
  {
    id: 703,
    studentName: "Hamza Wael",
    planTitle: "Consultant",
    goal: "Mock interviews and CV review before applying to frontend roles in Dubai.",
  },
];

/* ------------------------------------------------------------------ */
/* Roadmap                                                            */
/* ------------------------------------------------------------------ */

export const roadmapStageTitles = [
  "HTML/CSS Basics",
  "JavaScript ES6+",
  "React Fundamentals",
  "React Hooks",
  "State Management",
  "Next.js and Deployment",
];

export type StageStatus = "Completed" | "Started" | "NotStarted";

export const roadmapStages: {
  id: number;
  title: string;
  description: string;
  order: number;
  status: StageStatus;
  resources: {
    title: string;
    description: string;
    filePaths: string;
    urls: string;
  }[];
}[] = [
  {
    id: 11,
    title: "HTML/CSS Basics",
    description:
      "Semantic HTML, the box model, Flexbox and Grid. Build a responsive landing page from a Figma design.",
    order: 1,
    status: "Completed",
    resources: [
      {
        title: "CSS Layout Handbook",
        description: "Flexbox, Grid and responsive patterns in one place.",
        filePaths: file("css-layout-handbook.pdf"),
        urls: "https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout, https://css-tricks.com/snippets/css/complete-guide-grid/",
      },
    ],
  },
  {
    id: 12,
    title: "JavaScript ES6+",
    description:
      "Modern JavaScript: modules, async/await, array methods and the DOM. Finish with a weather app that calls a public API.",
    order: 2,
    status: "Completed",
    resources: [
      {
        title: "JavaScript ES6+ Essentials",
        description: "The syntax you will use every day.",
        filePaths: file("javascript-es6-guide.pdf"),
        urls: "https://javascript.info/, https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide",
      },
    ],
  },
  {
    id: 13,
    title: "React Fundamentals",
    description:
      "Components, props, state and lists. Rebuild the weather app in React with reusable components.",
    order: 3,
    status: "Completed",
    resources: [
      {
        title: "Thinking in React",
        description: "Official guide to breaking a UI into components.",
        filePaths: "",
        urls: "https://react.dev/learn/thinking-in-react",
      },
    ],
  },
  {
    id: 14,
    title: "React Hooks",
    description:
      "useState, useEffect, useMemo, useRef and custom hooks. Add search, filters and persistence to your project.",
    order: 4,
    status: "Started",
    resources: [
      {
        title: "React Hooks Cheat Sheet",
        description: "When to reach for each hook, with examples.",
        filePaths: file("react-hooks-cheatsheet.pdf"),
        urls: "https://react.dev/reference/react/hooks",
      },
    ],
  },
  {
    id: 15,
    title: "State Management",
    description:
      "Server state with TanStack Query and client state with Context and Zustand. Refactor the project to fetch and cache data properly.",
    order: 5,
    status: "NotStarted",
    resources: [
      {
        title: "TanStack Query overview",
        description: "Caching, background refetching and mutations.",
        filePaths: "",
        urls: "https://tanstack.com/query/latest/docs/framework/react/overview",
      },
    ],
  },
  {
    id: 16,
    title: "Next.js and Deployment",
    description:
      "App Router, server components, SEO and deploying to Vercel. Ship the final capstone with a custom domain.",
    order: 6,
    status: "NotStarted",
    resources: [
      {
        title: "Frontend System Design Primer",
        description: "How to reason about rendering, state and performance.",
        filePaths: file("system-design-primer.pdf"),
        urls: "https://nextjs.org/learn",
      },
    ],
  },
];

/** Where each of the main mentor's students currently is in the roadmap. */
export const studentStageProgress: Record<number, number> = {
  101: 4,
  102: 2,
  103: 5,
  104: 1,
  105: 3,
};

export const struggles = [
  {
    studentId: 102,
    stageOrder: 2,
    timeSpent: 46,
    expectedDuration: 30,
    timeOverdue: 16,
  },
  {
    studentId: 104,
    stageOrder: 1,
    timeSpent: 28,
    expectedDuration: 20,
    timeOverdue: 8,
  },
  {
    studentId: 105,
    stageOrder: 3,
    timeSpent: 39,
    expectedDuration: 32,
    timeOverdue: 7,
  },
];

/* ------------------------------------------------------------------ */
/* Resources                                                          */
/* ------------------------------------------------------------------ */

export const resources = [
  {
    id: 301,
    title: "React Hooks Cheat Sheet",
    description:
      "A one page reference for every built in hook, with the common mistakes to avoid.",
    urls: ["https://react.dev/reference/react/hooks", "https://usehooks.com/"],
    files: [file("react-hooks-cheatsheet.pdf")],
  },
  {
    id: 302,
    title: "JavaScript ES6+ Essentials",
    description:
      "Modern syntax, promises and modules explained with short examples.",
    urls: ["https://javascript.info/"],
    files: [file("javascript-es6-guide.pdf")],
  },
  {
    id: 303,
    title: "CSS Layout Handbook",
    description:
      "Flexbox, Grid and responsive design patterns for real layouts.",
    urls: ["https://css-tricks.com/snippets/css/a-guide-to-flexbox/"],
    files: [file("css-layout-handbook.pdf")],
  },
  {
    id: 304,
    title: "Frontend System Design Primer",
    description:
      "How to plan rendering, state, caching and performance before writing code.",
    urls: ["https://nextjs.org/docs", "https://web.dev/learn/performance"],
    files: [file("system-design-primer.pdf")],
  },
  {
    id: 305,
    title: "Accessibility Checklist",
    description: "Practical WCAG checks to run on every page you build.",
    urls: [
      "https://www.a11yproject.com/checklist/",
      "https://webaim.org/resources/contrastchecker/",
    ],
    files: [],
  },
];

/** Which resources the main mentor has shared with which student. */
export const resourceAssignments: { resourceId: number; studentId: number }[] =
  [
    { resourceId: 301, studentId: 101 },
    { resourceId: 302, studentId: 101 },
    { resourceId: 304, studentId: 101 },
    { resourceId: 302, studentId: 102 },
    { resourceId: 303, studentId: 104 },
    { resourceId: 301, studentId: 103 },
    { resourceId: 305, studentId: 105 },
  ];

/* ------------------------------------------------------------------ */
/* Tasks                                                              */
/* ------------------------------------------------------------------ */

export const tasks: {
  id: number;
  title: string;
  taskType: "Mcq" | "Submission";
}[] = [
  { id: 201, title: "JavaScript Fundamentals Quiz", taskType: "Mcq" },
  { id: 202, title: "React Hooks Quiz", taskType: "Mcq" },
  {
    id: 203,
    title: "Build a Reusable Modal Component",
    taskType: "Submission",
  },
  { id: 204, title: "Weather App Code Review", taskType: "Submission" },
];

export const taskQuestions: Record<
  number,
  {
    id: number;
    question: string;
    options?: string[];
    score: number;
    correctAnswer: string;
    taskId: number;
  }[]
> = {
  201: [
    {
      id: 2011,
      question:
        "Which keyword declares a block scoped variable that cannot be reassigned?",
      options: ["var", "let", "const", "static"],
      correctAnswer: "const",
      score: 5,
      taskId: 201,
    },
    {
      id: 2012,
      question: "What does Array.prototype.map return?",
      options: ["The original array", "A new array", "A boolean", "undefined"],
      correctAnswer: "A new array",
      score: 5,
      taskId: 201,
    },
    {
      id: 2013,
      question: "Which statement waits for a Promise inside an async function?",
      options: ["yield", "await", "then", "defer"],
      correctAnswer: "await",
      score: 5,
      taskId: 201,
    },
    {
      id: 2014,
      question: "What is the result of typeof null?",
      options: ["null", "undefined", "object", "number"],
      correctAnswer: "object",
      score: 5,
      taskId: 201,
    },
  ],
  202: [
    {
      id: 2021,
      question: "Which hook runs side effects after the component renders?",
      options: ["useMemo", "useEffect", "useRef", "useId"],
      correctAnswer: "useEffect",
      score: 5,
      taskId: 202,
    },
    {
      id: 2022,
      question:
        "Which hook keeps a value between renders without triggering a re-render?",
      options: ["useState", "useRef", "useReducer", "useContext"],
      correctAnswer: "useRef",
      score: 5,
      taskId: 202,
    },
    {
      id: 2023,
      question: "What should a custom hook's name start with?",
      options: ["get", "hook", "use", "with"],
      correctAnswer: "use",
      score: 5,
      taskId: 202,
    },
    {
      id: 2024,
      question: "When does an effect with an empty dependency array run?",
      options: [
        "On every render",
        "Only after the first render",
        "Never",
        "Only on unmount",
      ],
      correctAnswer: "Only after the first render",
      score: 5,
      taskId: 202,
    },
  ],
  203: [
    {
      id: 2031,
      question:
        "Share a link to your Modal component (GitHub or CodeSandbox). It should support a title, custom content, closing on Escape and focus trapping.",
      score: 10,
      correctAnswer: "",
      taskId: 203,
    },
    {
      id: 2032,
      question:
        "Explain how you handled accessibility (focus, aria attributes, scroll locking).",
      score: 10,
      correctAnswer: "",
      taskId: 203,
    },
  ],
  204: [
    {
      id: 2041,
      question: "Paste the repository link for your weather app.",
      score: 10,
      correctAnswer: "",
      taskId: 204,
    },
    {
      id: 2042,
      question:
        "List the three changes you made after the code review and why.",
      score: 10,
      correctAnswer: "",
      taskId: 204,
    },
  ],
};

/** Tasks assigned to students, with scores once submitted. */
export const studentTasks: {
  id: number;
  tasksId: number;
  studentId: number;
  finalScore: number;
  submittedOn: string;
  completed: boolean;
}[] = [
  {
    id: 801,
    tasksId: 201,
    studentId: 101,
    finalScore: 75,
    submittedOn: daysAgo(18),
    completed: true,
  },
  {
    id: 802,
    tasksId: 204,
    studentId: 101,
    finalScore: 90,
    submittedOn: daysAgo(9),
    completed: true,
  },
  {
    id: 803,
    tasksId: 202,
    studentId: 101,
    finalScore: 0,
    submittedOn: daysAgo(3),
    completed: false,
  },
  {
    id: 804,
    tasksId: 203,
    studentId: 101,
    finalScore: 0,
    submittedOn: daysAgo(2),
    completed: false,
  },
  {
    id: 805,
    tasksId: 201,
    studentId: 102,
    finalScore: 50,
    submittedOn: daysAgo(6),
    completed: true,
  },
  {
    id: 806,
    tasksId: 201,
    studentId: 103,
    finalScore: 100,
    submittedOn: daysAgo(25),
    completed: true,
  },
  {
    id: 807,
    tasksId: 202,
    studentId: 103,
    finalScore: 75,
    submittedOn: daysAgo(4),
    completed: true,
  },
  {
    id: 808,
    tasksId: 201,
    studentId: 105,
    finalScore: 0,
    submittedOn: daysAgo(1),
    completed: false,
  },
];

/** Answers for completed tasks of the main student. */
export const completedAnswers: Record<
  number,
  {
    mcq: { mcqId: number; selectedAnswer: string; isCorrect: boolean }[];
    submission: { submissionId: number; text: string }[];
  }
> = {
  201: {
    mcq: [
      { mcqId: 2011, selectedAnswer: "const", isCorrect: true },
      { mcqId: 2012, selectedAnswer: "A new array", isCorrect: true },
      { mcqId: 2013, selectedAnswer: "await", isCorrect: true },
      { mcqId: 2014, selectedAnswer: "undefined", isCorrect: false },
    ],
    submission: [],
  },
  204: {
    mcq: [],
    submission: [
      {
        submissionId: 2041,
        text: "https://github.com/nour-hassan-demo/weather-app",
      },
      {
        submissionId: 2042,
        text: "1) Moved API calls into a custom useWeather hook. 2) Added loading and error states. 3) Replaced inline styles with CSS modules for consistency.",
      },
    ],
  },
};

/* ------------------------------------------------------------------ */
/* Chat                                                               */
/* ------------------------------------------------------------------ */

export type DemoMessage = {
  id: number;
  senderUserId: string;
  receiverUserId: string;
  message: string;
  sentAt: string;
  studentMentorId: number;
};

const S = MAIN_STUDENT.userId;
const M = MAIN_MENTOR.userId;

let msgId = 9000;
const msg = (
  from: string,
  to: string,
  text: string,
  when: string,
  assignmentId: number,
): DemoMessage => ({
  id: ++msgId,
  senderUserId: from,
  receiverUserId: to,
  message: text,
  sentAt: when,
  studentMentorId: assignmentId,
});

export const chatHistory: Record<number, DemoMessage[]> = {
  501: [
    msg(
      M,
      S,
      "Welcome to the roadmap, Nour! I reviewed your landing page, the layout is clean. Let's start JavaScript this week.",
      daysAgo(30, 18),
      501,
    ),
    msg(
      S,
      M,
      "Thank you! Should I focus on the DOM first or async code?",
      daysAgo(30, 19),
      501,
    ),
    msg(
      M,
      S,
      "DOM first, then promises and fetch. The weather app task will combine both.",
      daysAgo(30, 19),
      501,
    ),
    msg(
      S,
      M,
      "I pushed the weather app and submitted the review task.",
      daysAgo(9, 20),
      501,
    ),
    msg(
      M,
      S,
      "Great work, 18/20. Nice job extracting the useWeather hook. You are now on React Hooks, take your time with useEffect.",
      daysAgo(8, 11),
      501,
    ),
    msg(
      S,
      M,
      "Got it. The Hooks quiz and the Modal task are next on my list.",
      daysAgo(1, 21),
      501,
    ),
    msg(
      M,
      S,
      "Perfect. Remember focus trapping for the modal, and ping me if you get stuck. We have our call on Thursday.",
      daysAgo(0, 9),
      501,
    ),
  ],
  511: [
    msg(
      S,
      "u-mentor-salma",
      "Hi Salma, I shared my Figma file for the booking app case study.",
      daysAgo(5, 17),
      511,
    ),
    msg(
      "u-mentor-salma",
      S,
      "Thanks Nour! The flows are clear. Add the research insights before the wireframes so the story makes sense.",
      daysAgo(4, 12),
      511,
    ),
    msg(
      S,
      "u-mentor-salma",
      "Makes sense, I'll restructure it and send it again before our next session.",
      daysAgo(4, 13),
      511,
    ),
  ],
  502: [
    msg(
      M,
      "u-student-ziad",
      "Ziad, I left comments on your pull request about the fetch logic.",
      daysAgo(3, 15),
      502,
    ),
    msg(
      "u-student-ziad",
      M,
      "Thanks, fixing them today. Async/await still confuses me a bit.",
      daysAgo(3, 16),
      502,
    ),
    msg(
      M,
      "u-student-ziad",
      "That is normal. I added the ES6+ guide to your resources, read the promises section first.",
      daysAgo(2, 10),
      502,
    ),
  ],
  503: [
    msg(
      "u-student-farida",
      M,
      "I finished the State Management stage project!",
      daysAgo(2, 19),
      503,
    ),
    msg(
      M,
      "u-student-farida",
      "Amazing progress Farida. Next.js is the last stage, you are almost there.",
      daysAgo(1, 9),
      503,
    ),
  ],
  504: [
    msg(
      M,
      "u-student-adam",
      "Hi Adam, let's book our first consultation. Does Sunday evening work?",
      daysAgo(7, 18),
      504,
    ),
  ],
  505: [
    msg(
      "u-student-malak",
      M,
      "Could we talk about accessibility testing tools next session?",
      daysAgo(5, 14),
      505,
    ),
  ],
};

export const mentorAutoReplies = [
  "Thanks for the update! I'll take a look and get back to you today.",
  "Good question. Try breaking it into a smaller component first, then share what you have.",
  "Nice progress, keep going. Let's go through it together in our next session.",
];

export const studentAutoReplies = [
  "Thank you! I'll work on it and send an update soon.",
  "Got it, that helps a lot.",
];

/* ------------------------------------------------------------------ */
/* Admin                                                              */
/* ------------------------------------------------------------------ */

export const mentorApplications = [
  {
    id: 41,
    name: "Bassem Wael",
    email: "bassem.wael@mentoro.demo",
    image: avatar("bassem-wael"),
    jobTitle: "Senior iOS Engineer",
    category: "Mobile App Development",
    about:
      "iOS engineer with 7 years of Swift and SwiftUI experience. I want to help students publish their first App Store app.",
    location: "Cairo, Egypt",
    accountBank: "bassem.wael@instapay",
    introVideo: "",
    cv: file("system-design-primer.pdf"),
    linkedin: "linkedin.com/in/bassem-wael-demo",
    github: "github.com/bassem-wael-demo",
  },
  {
    id: 42,
    name: "Dina Ragab",
    email: "dina.ragab@mentoro.demo",
    image: avatar("dina-ragab"),
    jobTitle: "QA Automation Engineer",
    category: "Tools and Utilities Development",
    about:
      "Test automation engineer using Playwright and Cypress. I mentor developers who want to write reliable end to end tests.",
    location: "Alexandria, Egypt",
    accountBank: "dina.ragab@instapay",
    introVideo: "",
    cv: file("css-layout-handbook.pdf"),
    linkedin: "linkedin.com/in/dina-ragab-demo",
    github: "github.com/dina-ragab-demo",
  },
  {
    id: 43,
    name: "Hossam Eldin",
    email: "hossam.eldin@mentoro.demo",
    image: avatar("hossam-eldin"),
    jobTitle: "Blockchain Developer",
    category: "Blockchain Development",
    about:
      "Solidity developer who audited smart contracts for DeFi projects. I want to teach Web3 fundamentals responsibly.",
    location: "Tanta, Egypt",
    accountBank: "hossam.eldin@instapay",
    introVideo: "",
    cv: file("javascript-es6-guide.pdf"),
    linkedin: "linkedin.com/in/hossam-eldin-demo",
    github: "github.com/hossam-eldin-demo",
  },
];

const receipt = "/demo/files/payment-receipt.svg";

export type DemoPayment = {
  id: number;
  userId: string;
  userName: string;
  mentorId: number;
  amount: number;
  plan: "Roadmap" | "Customized" | "Consultant";
  senderAccount: string;
  notes: string;
  requestDay: number;
  decisionDay: number | null;
  status: "Pending" | "Accepted" | "Rejected";
};

export const payments: DemoPayment[] = [
  {
    id: 601,
    userId: "u-student-nour",
    userName: "Nour Hassan",
    mentorId: 2,
    amount: 700,
    plan: "Consultant",
    senderAccount: "nour.hassan@instapay",
    notes: "Paid via InstaPay, reference 48213.",
    requestDay: 1,
    decisionDay: null,
    status: "Pending",
  },
  {
    id: 602,
    userId: "u-student-jana",
    userName: "Jana Mahmoud",
    mentorId: 1,
    amount: 2200,
    plan: "Customized",
    senderAccount: "jana.m@instapay",
    notes: "Transferred from my bank app.",
    requestDay: 0,
    decisionDay: null,
    status: "Pending",
  },
  {
    id: 603,
    userId: "u-student-omnia",
    userName: "Omnia Fathy",
    mentorId: 4,
    amount: 2000,
    plan: "Roadmap",
    senderAccount: "01012345678 (Vodafone Cash)",
    notes: "",
    requestDay: 2,
    decisionDay: null,
    status: "Pending",
  },
  {
    id: 604,
    userId: "u-student-ziad",
    userName: "Ziad Hamdy",
    mentorId: 1,
    amount: 2200,
    plan: "Customized",
    senderAccount: "ziad.hamdy@instapay",
    notes: "",
    requestDay: 21,
    decisionDay: 20,
    status: "Accepted",
  },
  {
    id: 605,
    userId: "u-student-nour",
    userName: "Nour Hassan",
    mentorId: 1,
    amount: 1500,
    plan: "Roadmap",
    senderAccount: "nour.hassan@instapay",
    notes: "First month of the roadmap plan.",
    requestDay: 35,
    decisionDay: 34,
    status: "Accepted",
  },
  {
    id: 606,
    userId: "u-student-farida",
    userName: "Farida Yasser",
    mentorId: 1,
    amount: 1500,
    plan: "Roadmap",
    senderAccount: "farida.y@instapay",
    notes: "",
    requestDay: 49,
    decisionDay: 48,
    status: "Accepted",
  },
  {
    id: 607,
    userId: "u-student-karma",
    userName: "Karma Said",
    mentorId: 5,
    amount: 750,
    plan: "Consultant",
    senderAccount: "karma.said@instapay",
    notes: "Screenshot attached.",
    requestDay: 14,
    decisionDay: 13,
    status: "Rejected",
  },
];

export const paymentReceipt = receipt;

export const complaints: {
  id: number;
  userId: string;
  userName: string;
  content: string;
  notes: string;
  reason: string;
  status: "Pending" | "Resolved" | "Rejected";
  day: number;
}[] = [
  {
    id: 901,
    userId: "u-student-nour",
    userName: "Nour Hassan",
    content:
      "The video call link in my last session expired before the session started.",
    notes: "Mentor shared a new link and the session was held the same day.",
    reason: "",
    status: "Resolved",
    day: 16,
  },
  {
    id: 902,
    userId: "u-student-nour",
    userName: "Nour Hassan",
    content:
      "I uploaded my payment screenshot twice by mistake. Please keep only the latest one.",
    notes: "",
    reason: "",
    status: "Pending",
    day: 1,
  },
  {
    id: 903,
    userId: "u-mentor-omar",
    userName: "Omar Khaled",
    content: "A student keeps messaging outside of the agreed hours.",
    notes: "",
    reason: "",
    status: "Pending",
    day: 3,
  },
  {
    id: 904,
    userId: "u-student-ziad",
    userName: "Ziad Hamdy",
    content: "Quiz score did not update after I submitted.",
    notes: "Score synced after a refresh, no data was lost.",
    reason: "",
    status: "Resolved",
    day: 8,
  },
  {
    id: 905,
    userId: "u-student-karma",
    userName: "Karma Said",
    content: "I want a refund because I changed my mind about the plan.",
    notes: "",
    reason:
      "The plan had already started and refunds are only available within 48 hours.",
    status: "Rejected",
    day: 12,
  },
  {
    id: 906,
    userId: "u-student-malak",
    userName: "Malak Tamer",
    content:
      "The roadmap page shows a stage as locked even though I finished the previous one.",
    notes: "",
    reason: "",
    status: "Pending",
    day: 0,
  },
];
