import { AddResourceForm } from "../../_components/add-resource-form";
import { useTranslations } from "next-intl";

const AddCourse = () => {
  const t = useTranslations("Resources.AddCourse");

  return (
    <div className="space-y-4">
      <h3 className="text-3xl font-extrabold">{t("heading")}</h3>
      <AddResourceForm />
    </div>
  );
};

export default AddCourse;