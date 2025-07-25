import type { StaticImageData } from "next/image";
import type { Plan } from "./plans";

export interface User {
  id: number;
  userId: string;
  name: string;
  email: string;
  image: string;
  jobTitle: string;
  about: string;
  location: string;
  spotleft: number;
  category: string;
  linkedin: string;
  github: string;
  mentorPlans: {
    consultantPlan: Plan | null;
    customPlan: Plan | null;
    roadMapPlan: Plan | null;
  } | null;
  token: string;
  role: string;
}

export interface MentorData {
  id: number;
  name: string;
  userId: string;
  email: string;
  image: string;
  jobTitle: string;
  about: string;
  location: string;
  spotleft: number;
  category: string;
  linkedin: string;
  github: string;
  role: string | null;
  averageRating: number;
  mentorPlans: null;
}

export interface Mentor {
  name: string;
  role: string;
  skills: string[];
  picture: StaticImageData;
  location: string;
  about: string;
}

export interface Link {
  description: string;
  link: string;
}

export interface Course {
  name: string;
  category: string;
  items: number;
  description: string;
  studentsNum: number;
  content?: Content[];
}

export interface Content {
  name: string;
  type: string;
}
