export type CustomizedPlan = {
  title: "Custom";
  description: string;
  duration: string;
  price: number;
};

export type RoadmapPlan = {
  title: "Roadmap";
  description: string;
  duration: string;
  price: number;
};

export type GuidancePlan = {
  title: "Consultant";
  description: string;
  duration: string;
  price: number;
};

export type Plan = CustomizedPlan | RoadmapPlan | GuidancePlan;
