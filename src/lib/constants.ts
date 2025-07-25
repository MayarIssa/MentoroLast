import ahmedImg from "@/assets/mentors/ahmed-mohammed.png";
import jayaImg from "@/assets/mentors/jaya-wills.png";
import johnImg from "@/assets/mentors/john-doe.png";
import { CodeXml } from "lucide-react";

export const API_URL = "http://mentorohelp.runasp.net";

export const ROLES = [
  "Backend Developer",
  "Frontend Developer",
  "Figma Designer",
];

export const MENTORS = [
  {
    name: "Jaya Wills",
    role: "Backend Developer",
    skills: ["C#", "ASP.NET", "OOP", "Data Structures"],
    picture: jayaImg,
    location: "Alexandria, Egypt",
    about:
      'I joined Google in Aug 2020 and got "Exceed Expectation" in my first performance review. I got promoted to SWE3 in May 2022, although I had switched teams 6 months before and had to learn everything from scratch. I have taken 25+ interviews for Google and have mentored 10+ people to get into Google. I have also mentored 5+ Googlers on enhancing their career and promo packet (L3 -> L4). I joined Google in Aug 2020 and got "Exceed Expectation" in my first performance review. I got promoted to SWE3 in May 2022',
  },
  {
    name: "Ahmed Mohammed",
    role: "Frontend Developer",
    skills: ["C#", "ASP.NET", "OOP", "Data Structures"],
    picture: ahmedImg,
    location: "Alexandria, Egypt",
    about:
      'I joined Google in Aug 2020 and got "Exceed Expectation" in my first performance review. I got promoted to SWE3 in May 2022, although I had switched teams 6 months before and had to learn everything from scratch. I have taken 25+ interviews for Google and have mentored 10+ people to get into Google. I have also mentored 5+ Googlers on enhancing their career and promo packet (L3 -> L4). I joined Google in Aug 2020 and got "Exceed Expectation" in my first performance review. I got promoted to SWE3 in May 2022',
  },
  {
    name: "John Doe",
    role: "Figma Designer",
    skills: ["C#", "ASP.NET", "OOP", "Data Structures"],
    picture: johnImg,
    location: "Alexandria, Egypt",
    about:
      'I joined Google in Aug 2020 and got "Exceed Expectation" in my first performance review. I got promoted to SWE3 in May 2022, although I had switched teams 6 months before and had to learn everything from scratch. I have taken 25+ interviews for Google and have mentored 10+ people to get into Google. I have also mentored 5+ Googlers on enhancing their career and promo packet (L3 -> L4). I joined Google in Aug 2020 and got "Exceed Expectation" in my first performance review. I got promoted to SWE3 in May 2022',
  },
];

export const CATEGORIES = [
  {
    name: "Web Development",
    Icon: CodeXml,
  },
  {
    name: "Mobile App Development",
    Icon: CodeXml,
  },
  {
    name: "Desktop Software Development",
    Icon: CodeXml,
  },
  {
    name: "Embedded Systems Development",
    Icon: CodeXml,
  },
  {
    name: "Game Development",
    Icon: CodeXml,
  },
  {
    name: "System Software Development",
    Icon: CodeXml,
  },
  {
    name: "Cloud Development",
    Icon: CodeXml,
  },
  {
    name: "Data Science and Machine Learning Development",
    Icon: CodeXml,
  },
  {
    name: "Enterprise Software Development",
    Icon: CodeXml,
  },
  {
    name: "DevOps and Infrastructure Development",
    Icon: CodeXml,
  },
  {
    name: "Security Software Development",
    Icon: CodeXml,
  },
  {
    name: "Artificial Intelligence",
    Icon: CodeXml,
  },
  {
    name: "Robotics Development",
    Icon: CodeXml,
  },
  {
    name: "Virtual Reality (VR) and Augmented Reality (AR) Development",
    Icon: CodeXml,
  },
  {
    name: "Blockchain Development",
    Icon: CodeXml,
  },
  {
    name: "Scientific and Computational Development",
    Icon: CodeXml,
  },
  {
    name: "Financial Software Development",
    Icon: CodeXml,
  },
  {
    name: "Educational and E-Learning Development",
    Icon: CodeXml,
  },
  {
    name: "Automation and Scripting",
    Icon: CodeXml,
  },
  {
    name: "Tools and Utilities Development",
    Icon: CodeXml,
  },
  {
    name: "Media and Entertainment Software Development",
    Icon: CodeXml,
  },
];

export const COURSES = [
  {
    name: "Web Development Fundamentals",
    category: "Web Development",
    items: 15,
    description:
      "Learn the basics of web development including HTML, CSS, and JavaScript.",
    studentsNum: 25,
    content: [
      {
        name: "HTML Basics.pdf",
        type: "file",
      },
      {
        name: "CSS Fundamentals.pdf",
        type: "file",
      },
      {
        name: "JavaScript Introduction.pdf",
        type: "file",
      },
    ],
  },
  {
    name: "Mobile App Development with React Native",
    category: "Mobile App Development",
    items: 12,
    description:
      "Build cross-platform mobile applications using React Native framework.",
    studentsNum: 18,
    content: [
      {
        name: "React Native Setup.pdf",
        type: "file",
      },
      {
        name: "Mobile UI Components.pdf",
        type: "file",
      },
    ],
  },
  {
    name: "Cloud Computing Essentials",
    category: "Cloud Development",
    items: 20,
    description:
      "Master cloud computing concepts and AWS services for scalable applications.",
    studentsNum: 30,
    content: [
      {
        name: "AWS Basics.pdf",
        type: "file",
      },
      {
        name: "Cloud Architecture.pdf",
        type: "file",
      },
    ],
  },
  {
    name: "Data Science Fundamentals",
    category: "Data Science and Machine Learning Development",
    items: 18,
    description:
      "Introduction to data science, machine learning, and statistical analysis.",
    studentsNum: 22,
    content: [
      {
        name: "Python for Data Science.pdf",
        type: "file",
      },
      {
        name: "Machine Learning Basics.pdf",
        type: "file",
      },
    ],
  },
  {
    name: "DevOps Practices",
    category: "DevOps and Infrastructure Development",
    items: 14,
    description:
      "Learn DevOps practices, CI/CD pipelines, and infrastructure as code.",
    studentsNum: 20,
    content: [
      {
        name: "Docker Basics.pdf",
        type: "file",
      },
      {
        name: "Kubernetes Introduction.pdf",
        type: "file",
      },
    ],
  },
  {
    name: "Game Development with Unity",
    category: "Game Development",
    items: 16,
    description:
      "Create interactive games using Unity game engine and C# programming.",
    studentsNum: 15,
    content: [
      {
        name: "Unity Basics.pdf",
        type: "file",
      },
      {
        name: "Game Physics.pdf",
        type: "file",
      },
    ],
  },
];

export const MAX_FILE_SIZE = 24 * 1024 * 1024; // 24MB
export const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const ACCEPTED_DOC_TYPES = ["application/pdf"];
export const ACCEPTED_VIDEO_TYPES = ["video/mp4"];
