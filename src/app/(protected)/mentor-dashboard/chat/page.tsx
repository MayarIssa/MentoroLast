import { getCurrentUser, getUserToken } from "@/server/actions/auth";
import { Chat } from "../../_components/chat";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

export default async function ChatPage() {
  const token = await getUserToken();
  const currentUser = await getCurrentUser();
  const t = await getTranslations("Chat");

  if (!token || !currentUser) {
    return notFound();
  }

  return (
    <div className="space-y-2">
      <div className="max-w-screen-lg">
        <h2 className="text-foreground text-4xl font-extrabold">
          {t("ChatPage.heading")}
        </h2>
        <p className="text-muted-foreground mt-2 text-sm">
          {t("ChatPage.subtext")}
        </p>
      </div>
      <Chat token={token} currentUserId={currentUser.userId} />
    </div>
  );
}
