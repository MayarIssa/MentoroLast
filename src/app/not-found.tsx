import MaxWidthWrapper from "@/components/max-width-wrapper";
import { buttonVariants } from "@/components/ui/button";
import { ArrowRight, TriangleAlert } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";

const NotFound = () => {
  const t = useTranslations("NotFound");
  return (
    <MaxWidthWrapper className="flex flex-1 items-center justify-center">
      <div className="my-16 flex flex-col items-center gap-4 rounded-lg p-32 ring ring-gray-100">
        <TriangleAlert className="stroke-brand-200 size-32" />
        <p className="text-2xl">{t("title")}</p>
        <Link className={buttonVariants({})} href="/">
          {t("goHome")}
          <ArrowRight />
        </Link>
      </div>
    </MaxWidthWrapper>
  );
};

export default NotFound;
