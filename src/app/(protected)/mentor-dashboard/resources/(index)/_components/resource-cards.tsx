"use client";

import { Spinner } from "@/components/spinner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useResources } from "@/hooks/use-resources";
import { Book, BookOpen, Plus, Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useTranslations } from "next-intl";

export function ResourceCards() {
  const t = useTranslations("Resources.ResourceCards");
  const { data: resources, isPending } = useResources();
  const [searchQuery, setSearchQuery] = useState("");

  if (isPending) return <Spinner size="page" />;

  const filteredResources = resources?.filter((resource) => {
    const matchesSearch =
      searchQuery === "" ||
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearch;
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-2">
        <div className="flex w-full items-center gap-3">
          <Search className="mt-4 size-5 stroke-3" />
          <Input
            placeholder={t("searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-lg"
          />
        </div>

        <Button asChild>
          <Link href="/mentor-dashboard/resources/add">
            <Plus className="mr-2 h-4 w-4" />
            {t("createButton")}
          </Link>
        </Button>
      </div>

      {filteredResources?.length ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredResources.map((resource) => (
            <Link
              key={resource.id}
              href={`/mentor-dashboard/resources/${resource.id}`}
            >
              <Card className="h-full transform transition-all hover:scale-105 hover:shadow-lg">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-full">
                      <Book className="h-5 w-5" />
                    </div>
                    <CardTitle>{resource.title}</CardTitle>
                  </div>
                  <CardDescription className="pt-4">
                    {resource.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
          <div className="text-muted-foreground mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
            <BookOpen className="h-10 w-10" />
          </div>
          <h3 className="text-2xl font-bold tracking-tight">
            {t("noResources")}
          </h3>
          <p className="text-muted-foreground text-sm">
            {t("noResourcesSubtext")}
          </p>
        </div>
      )}
    </div>
  );
}
