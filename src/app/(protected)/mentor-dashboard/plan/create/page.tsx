import { PlanForm } from "./_components/plan-form";
import { getTranslations } from "next-intl/server";

export default async function CreatePlan({
  searchParams,
}: {
  searchParams: Promise<{ type: "Customized" | "Roadmap" | "Guidance" }>;
}) {
  const { type } = await searchParams;
  const t = await getTranslations("Plans.CreatePlan");

  return (
    <section className="space-y-4">
      <h3 className="text-3xl font-semibold">{t("heading")}</h3>
      <PlanForm type={type} />
    </section>
  );
}
