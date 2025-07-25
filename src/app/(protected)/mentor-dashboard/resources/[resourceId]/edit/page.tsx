import { API } from "@/lib/api";
import { notFound } from "next/navigation";
import { EditResourceForm } from "../../../_components/edit-resource-form";
import { getTranslations, getLocale } from "next-intl/server";

export default async function EditResource({
  params,
}: {
  params: Promise<{ resourceId: string }>;
}) {
  const t = await getTranslations("Resources.EditResource");
  const locale = await getLocale();
  const isArabic = locale === "ar";
  const resourceId = +(await params).resourceId;
  if (isNaN(resourceId)) {
    return notFound();
  }

  const resource = await API.queries.resources.getResourceById(resourceId);
  if (resource.statusCode === 404) {
    return notFound();
  }

  return (
    <div dir={isArabic ? "rtl" : "ltr"} className="space-y-8">
      <h3 className="text-foreground text-5xl font-bold">{t("heading")}</h3>
      <EditResourceForm
        defaultValues={{
          title: resource.title,
          description: resource.description,
          files: resource.files,
          links: resource.urls.map((url) => ({ value: url })),
        }}
      />
    </div>
  );
}
