"use client";

import { API } from "@/lib/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ExternalLink, FileText, BookOpen, Download } from "lucide-react";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { API_URL } from "@/lib/constants";

export default function ResourcesPage() {
  const t = useTranslations("ResourcesPage");

  const { data: resources = [], isLoading } = useQuery({
    queryKey: ["student-resources"],
    queryFn: () => API.queries.resources.getStudentResources(),
  });

  if (isLoading) {
    return <div>{t("loading")}</div>;
  }

  if (!resources || resources.length === 0) {
    return (
      <div className="container mx-auto p-6">
        <div className="mb-6 flex items-center">
          <BookOpen className="text-primary mr-3 h-8 w-8" />
          <div>
            <h1 className="text-3xl font-bold">{t("heading")}</h1>
            <p className="text-muted-foreground">{t("description")}</p>
          </div>
        </div>
        <Card className="py-12 text-center">
          <CardContent>
            <BookOpen className="text-muted-foreground mx-auto mb-4 h-16 w-16" />
            <h3 className="mb-2 text-xl font-semibold">{t("no_resources")}</h3>
            <p className="text-muted-foreground">
              {t("no_resources_description")}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6 flex items-center">
        <BookOpen className="text-primary mr-3 h-8 w-8" />
        <div>
          <h1 className="text-3xl font-bold">{t("heading")}</h1>
          <p className="text-muted-foreground">{t("description")}</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {resources.map((resource) => (
          <Card
            key={resource.id}
            className="transition-shadow duration-200 hover:shadow-lg"
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="mb-2 text-xl">
                    {resource.title}
                  </CardTitle>
                  <CardDescription className="text-sm leading-relaxed">
                    {resource.description}
                  </CardDescription>
                </div>
                <Badge variant="secondary" className="ml-2">
                  {t("id", { id: resource.id })}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {resource.urls && resource.urls.length > 0 && (
                <div>
                  <div className="mb-3 flex items-center">
                    <ExternalLink className="mr-2 h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium">
                      {t("online_resources")}
                    </span>
                    <Badge variant="outline" className="ml-2">
                      {resource.urls.length}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    {resource.urls.map((url, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="h-auto w-full justify-start p-3"
                        asChild
                      >
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center"
                        >
                          <ExternalLink className="mr-2 h-3 w-3 flex-shrink-0" />
                          <span className="truncate text-left">
                            {url.length > 40
                              ? `${url.substring(0, 40)}...`
                              : url}
                          </span>
                        </a>
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {resource.urls?.length > 0 && resource.files?.length > 0 && (
                <Separator />
              )}

              {resource.files && resource.files.length > 0 && (
                <div>
                  <div className="mb-3 flex items-center">
                    <FileText className="mr-2 h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium">{t("files")}</span>
                    <Badge variant="outline" className="ml-2">
                      {resource.files.length}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    {resource.files.map((file, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="h-auto w-full justify-start p-3"
                        asChild
                      >
                        <a
                          href={`${API_URL}${file}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center"
                        >
                          <Download className="mr-2 h-3 w-3 flex-shrink-0" />
                          <span className="truncate text-left">
                            {file.split("/").pop() ?? file}
                          </span>
                        </a>
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {(!resource.urls || resource.urls.length === 0) &&
                (!resource.files || resource.files.length === 0) && (
                  <div className="text-muted-foreground py-4 text-center">
                    <FileText className="mx-auto mb-2 h-8 w-8 opacity-50" />
                    <p className="text-sm">{t("no_resources_item")}</p>
                  </div>
                )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 border-t pt-6">
        <div className="grid grid-cols-1 gap-4 text-center md:grid-cols-3">
          <div className="p-4">
            <div className="text-primary text-2xl font-bold">
              {resources.length}
            </div>
            <div className="text-muted-foreground text-sm">
              {t("total_resources")}
            </div>
          </div>
          <div className="p-4">
            <div className="text-2xl font-bold text-blue-600">
              {resources.reduce(
                (sum, resource) => sum + (resource.urls?.length ?? 0),
                0,
              )}
            </div>
            <div className="text-muted-foreground text-sm">
              {t("online_links")}
            </div>
          </div>
          <div className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {resources.reduce(
                (sum, resource) => sum + (resource.files?.length ?? 0),
                0,
              )}
            </div>
            <div className="text-muted-foreground text-sm">
              {t("files_available")}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
