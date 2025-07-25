import { API } from "@/lib/api";
import { MentorRequestDetails } from "./../_components/mentor-request-details";
import { notFound } from "next/navigation";

export default async function MentorRequestPage({
  params,
}: {
  params: Promise<{ mentorId: string }>;
}) {
  const { mentorId } = await params;

  try {
    const mentorRequest = await API.queries.admin.getMentorRequestById(
      Number(mentorId),
    );

    return <MentorRequestDetails request={mentorRequest} />;
  } catch {
    return notFound();
  }
}
