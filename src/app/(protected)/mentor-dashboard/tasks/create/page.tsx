import { CreateTaskForm } from "./_components/create-task-form";
import MaxWidthWrapper from "@/components/max-width-wrapper";
import { useTranslations } from "next-intl";

export default function AddTask() {
  const t = useTranslations("Tasks.CreateTask");
  return (
    <MaxWidthWrapper>
      <section className="space-y-4">
        <h3 className="text-3xl font-semibold">{t("heading")}</h3>
        <CreateTaskForm />
      </section>
    </MaxWidthWrapper>
  );
}