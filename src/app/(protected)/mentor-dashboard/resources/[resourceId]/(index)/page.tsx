import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { notFound } from "next/navigation";
import { API } from "@/lib/api";
import {
  Book,
  DownloadCloud,
  Link2,
  Pencil,
  FileText,
  ExternalLink,
} from "lucide-react";
import { API_URL } from "@/lib/constants";
import { DeleteResourceButton } from "./_components/delete-resource-button";
import { getTranslations, getLocale } from "next-intl/server";

interface ResourceParams {
  params: Promise<{ resourceId: string }>;
}

export default async function Resource({ params }: ResourceParams) {
  const t = await getTranslations("Resources");
  const isArabic = (await getLocale()).startsWith("ar");
  const resourceId = +(await params).resourceId;
  if (isNaN(resourceId)) {
    return notFound();
  }

  const resource = await API.queries.resources.getResourceById(resourceId);
  if (resource.statusCode === 404) {
    return notFound();
  }

  return (
    <div dir={isArabic ? "rtl" : "ltr"} className="space-y-6">
      {/* Header Card */}
      <Card className="border-l-primary from-primary/5 border-l-4 bg-gradient-to-r to-transparent">
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <CardTitle className="text-foreground text-2xl font-bold lg:text-3xl">
                {resource.title}
              </CardTitle>
              <Badge variant="secondary" className="w-fit">
                <FileText size={14} className={isArabic ? "ml-1" : "mr-1"} />
                {t("Course.resourceLabel")}
              </Badge>
            </div>
            <div className="flex gap-2">
              <DeleteResourceButton resourceId={resourceId} />
              <Button
                asChild
                className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                <Link href={`/mentor-dashboard/resources/${resourceId}/edit`}>
                  <Pencil size={16} className={isArabic ? "ml-2" : "mr-2"} />
                  {t("Course.editButton")}
                </Link>
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Content Cards */}
      <div className="grid gap-6">
        {/* Description Card */}
        <Card className="transition-all duration-300 hover:shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Book size={20} className="text-primary" />
              {t("Course.descriptionSection")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p
              className={`text-muted-foreground leading-relaxed ${
                isArabic ? "text-right" : "text-left"
              }`}
            >
              {resource.description}
            </p>
          </CardContent>
        </Card>

        {/* Files Card */}
        <Card className="transition-all duration-300 hover:shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-xl">
              <DownloadCloud size={20} className="text-primary" />
              {t("Course.filesSection")}
              <Badge variant="outline" className="ml-auto">
                {resource.files.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {resource.files.length > 0 ? (
              <div className="space-y-3">
                {resource.files.map((file, index) => (
                  <div key={file}>
                    <div className="group bg-muted/30 hover:bg-muted/50 rounded-lg border p-3 transition-all duration-200 hover:shadow-sm">
                      <Button
                        variant="ghost"
                        asChild
                        className="text-primary hover:text-primary/80 h-auto w-full justify-start p-0 hover:bg-transparent"
                      >
                        <a
                          href={`${API_URL}${file}`}
                          target="_blank"
                          className="flex items-center gap-3"
                        >
                          <DownloadCloud size={16} className="flex-shrink-0" />
                          <span className="flex-1 truncate text-left">
                            {t("Course.downloadLink", {
                              filename: file.split("_").pop() ?? "",
                            })}
                          </span>
                          <ExternalLink
                            size={14}
                            className="flex-shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
                          />
                        </a>
                      </Button>
                    </div>
                    {index < resource.files.length - 1 && (
                      <Separator className="mt-3" />
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground py-8 text-center">
                {t("Course.noFiles") || "No files available"}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Links Card */}
        <Card className="transition-all duration-300 hover:shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Link2 size={20} className="text-primary" />
              {t("Course.linksSection")}
              <Badge variant="outline" className="ml-auto">
                {resource.urls.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {resource.urls.length > 0 ? (
              <div className="space-y-3">
                {resource.urls.map((url, index) => (
                  <div key={`${url}-${index}`}>
                    <div className="group bg-muted/30 hover:bg-muted/50 rounded-lg border p-3 transition-all duration-200 hover:shadow-sm">
                      <Button
                        variant="ghost"
                        asChild
                        className="text-primary hover:text-primary/80 h-auto w-full justify-start p-0 hover:bg-transparent"
                      >
                        <a
                          href={url}
                          target="_blank"
                          className="flex items-center gap-3"
                        >
                          <Link2 size={16} className="flex-shrink-0" />
                          <span className="flex-1 truncate text-left">
                            {url.length > 50 ? `${url.slice(0, 50)}...` : url}
                          </span>
                          <ExternalLink
                            size={14}
                            className="flex-shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
                          />
                        </a>
                      </Button>
                    </div>
                    {index < resource.urls.length - 1 && (
                      <Separator className="mt-3" />
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground py-8 text-center">
                {t("Course.noLinks") || "No links available"}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
