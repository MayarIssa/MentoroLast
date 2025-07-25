import { getCurrentUser } from "@/server/actions/auth";
import { Chat } from "../../_components/chat";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

export default async function ChatPage() {
  const currentUser = await getCurrentUser();
  const t = await getTranslations("Chat.ChatPage");

  if (!currentUser) {
    return notFound();
  }

  return (
    <div className="space-y-6">
      <div className="max-w-screen-lg">
        <h2 className="text-foreground text-4xl font-extrabold">
          {t("heading")}
        </h2>
        <p className="text-muted-foreground mt-2 text-sm">{t("subtext1")}</p>
      </div>
      <Chat token={currentUser.token} currentUserId={currentUser.userId} />
    </div>
  );
}
