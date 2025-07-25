import MaxWidthWrapper from "@/components/max-width-wrapper";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { useTranslations } from "next-intl";
import { TaskCards, TaskCardsSkeleton } from "./_components/task-cards";

export default function Tasks() {
  const t = useTranslations("Tasks");

  return (
    <MaxWidthWrapper>
      <section className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              {t("heading")}
            </h2>
            <p className="text-muted-foreground">{t("subheading")}</p>
          </div>

          <Button asChild>
            <Link href="/mentor-dashboard/tasks/create">
              <Plus className="mr-2 h-4 w-4" />
              {t("createTask")}
            </Link>
          </Button>
        </div>

        {/* Tasks API isn't working yet */}
        <Suspense fallback={<TaskCardsSkeleton />}>
          <TaskCards />
        </Suspense>
      </section>
    </MaxWidthWrapper>
  );
}
