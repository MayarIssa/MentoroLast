import { API } from "@/lib/api";
import { getTranslations } from "next-intl/server";
import { PaymentRequestCard } from "./_components/payment-request-card";

type MentorDetails = {
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
    roadmapPlan: {
      id: number;
      title: string;
      description: string;
      duration: string;
      price: number;
    };
    customPlan: {
      id: number;
      title: string;
      description: string;
      duration: string;
      price: number;
    };
    consultantPlan: {
      id: number;
      title: string;
      description: string;
      duration: string;
      price: number;
    };
  };
};

type PaymentRequestData = {
  mentorId: string;
  mentorName: string;
  goal: string;
  planTitle: string;
  status: string;
  mentorDetails: MentorDetails;
  planDetails: {
    id: number;
    title: string;
    description: string;
    duration: string;
    price: number;
  };
};

type MentorData = {
  id: number;
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
};

type MentorsResponse = {
  data: MentorData[];
};

export default async function RequestsPage() {
  const requests = await API.queries.requests.getAcceptedRequestsByMentor();
  const mentors: MentorsResponse = await API.queries.mentors.getAllMentors();
  const t = await getTranslations("StudentPaymentRequests");

  // Create a map of mentor names to their IDs
  const mentorNameToIdMap = new Map<string, string>();
  mentors.data.forEach((mentor: MentorData) => {
    mentorNameToIdMap.set(mentor.name, mentor.id.toString());
  });

  // Process requests to get payment request data
  const paymentRequests: PaymentRequestData[] = [];

  for (const request of requests) {
    const mentorId = mentorNameToIdMap.get(request.mentorName);

    if (mentorId) {
      try {
        // Get mentor details
        const mentorDetails = await API.queries.mentors.getMentorById(mentorId);
        console.log("[mentorDetails]", mentorDetails);

        // Find the plan details based on planTitle
        let planDetails;

        const planTitleLower = request.planTitle?.toLowerCase() ?? "";

        if (planTitleLower.includes("roadmap")) {
          if (mentorDetails.mentorPlans) {
            planDetails = mentorDetails.mentorPlans.roadmapPlan!;
          }
        } else if (planTitleLower.includes("custom")) {
          if (mentorDetails.mentorPlans) {
            planDetails = mentorDetails.mentorPlans.customPlan!;
          }
        } else if (planTitleLower.includes("consultant")) {
          if (mentorDetails.mentorPlans) {
            planDetails = mentorDetails.mentorPlans.consultantPlan!;
          }
        } else {
          // Default to customPlan if no match
          if (mentorDetails.mentorPlans) {
            planDetails = mentorDetails.mentorPlans.customPlan!;
          }
        }

        if (planDetails) {
          paymentRequests.push({
            mentorId,
            mentorName: request.mentorName,
            goal: request.goal,
            planTitle: request.planTitle,
            status: request.status,
            mentorDetails,
            planDetails,
          });
        }
      } catch (error) {
        console.error(
          `Failed to fetch mentor details for ${request.mentorName}:`,
          error,
        );
      }
    }
  }

  return (
    <div className="container mx-auto">
      <div className="mb-8">
        <h1 className="text-foreground mb-2 text-3xl font-bold">
          {t("title")}
        </h1>
        <p className="text-muted-foreground">{t("description")}</p>
      </div>

      {paymentRequests.length === 0 ? (
        <div className="py-12 text-center">
          <div className="bg-muted mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full">
            <span className="text-2xl">💳</span>
          </div>
          <p className="text-muted-foreground text-lg">{t("noRequests")}</p>
          <p className="text-muted-foreground mt-2 text-sm">
            {t("noRequestsHint")}
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
          {paymentRequests.map((request, index) => (
            <PaymentRequestCard
              key={`${request.mentorId}-${request.planTitle}-${index}`}
              request={request}
            />
          ))}
        </div>
      )}
    </div>
  );
}
