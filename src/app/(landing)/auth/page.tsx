import MaxWidthWrapper from "@/components/max-width-wrapper";
import AuthPanel from "./_components/auth-panel";
import { getCurrentUser } from "@/server/actions/auth";
import { notFound } from "next/navigation";

export default async function Auth() {
  const user = await getCurrentUser();
  if (user) {
    return notFound();
  }

  return (
    <MaxWidthWrapper className="my-16 flex-1">
      <AuthPanel />
    </MaxWidthWrapper>
  );
}
