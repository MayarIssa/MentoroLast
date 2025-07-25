"use client";

import { roadmapMutations } from "@/lib/api/mutations/roadmap";
import { roadmapQueries } from "@/lib/api/queries/roadmap";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Loader2,
  Play,
  ExternalLink,
  Download,
  CheckCircle,
  Lock,
  Clock,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { API_URL } from "@/lib/constants";

// Type for stage from the API response
type Stage = {
  id: number;
  title: string;
  description: string;
  order: number;
  roadmapPlanId: number;
  resources: {
    title: string;
    description: string;
    filePaths: string;
    urls: string;
  }[];
  status: string;
};

export default function Roadmaps() {
  const queryClient = useQueryClient();
  const t = useTranslations("StudentRoadmaps");

  const {
    data: roadmapsData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["roadmaps"],
    queryFn: () => roadmapQueries.getRoadmap(),
  });
  console.log(roadmapsData);

  const { mutate: startStage, isPending: isStarting } = useMutation({
    mutationFn: (stageId: number) => roadmapMutations.startStage(stageId),
    onSuccess: () => {
      toast.success(t("stageStartedSuccess"));
      void queryClient.invalidateQueries({ queryKey: ["roadmaps"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const { mutate: completeStage, isPending: isCompleting } = useMutation({
    mutationFn: (stageId: number) => roadmapMutations.completeStage(stageId),
    onSuccess: () => {
      toast.success(t("stageCompletedSuccess"));
      void queryClient.invalidateQueries({ queryKey: ["roadmaps"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-destructive">{t("loadError")}</p>
      </div>
    );
  }

  const roadmaps = roadmapsData?.roadmaps ?? [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-500";
      case "Started":
        return "bg-yellow-500";
      case "NotStarted":
      default:
        return "bg-gray-400";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "Started":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "NotStarted":
      default:
        return <Lock className="h-4 w-4 text-gray-400" />;
    }
  };

  const parseUrls = (urlsString: string): string[] => {
    if (!urlsString) return [];
    try {
      return urlsString
        .split(",")
        .map((url) => url.trim())
        .filter((url) => url);
    } catch {
      return [];
    }
  };

  const parseFilePaths = (filePathsString: string): string[] => {
    if (!filePathsString) return [];
    try {
      return filePathsString
        .split(",")
        .map((path) => path.trim())
        .filter((path) => path);
    } catch {
      return [];
    }
  };

  const getFileName = (filePath: string): string => {
    return filePath.split("/").pop() ?? filePath;
  };

  const canStartStage = (stages: Stage[], currentStageOrder: number) => {
    if (currentStageOrder === 1) return true;

    for (let i = 1; i < currentStageOrder; i++) {
      const previousStage = stages.find((stage) => stage.order === i);
      if (!previousStage || previousStage.status !== "Completed") {
        return false;
      }
    }
    return true;
  };

  return (
    <div className="p-4 md:p-6">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">{t("title")}</h1>
      </div>
      <div className="space-y-6">
        {roadmaps.map(({ roadmap, stages }, index) => (
          <Card key={`${roadmap.id}-${index}`}>
            <CardHeader>
              <CardTitle>{roadmap.title}</CardTitle>
              <CardDescription>{roadmap.description}</CardDescription>
              {roadmap.mentorName && (
                <p className="text-muted-foreground text-sm">
                  {t("mentorLabel", { name: roadmap.mentorName })}
                </p>
              )}
              {roadmap.duration && (
                <p className="text-muted-foreground text-sm">
                  {t("durationLabel", { duration: roadmap.duration })}
                </p>
              )}
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {stages.map((stage) => {
                  const isStarted = stage.status === "Started";
                  const isCompleted = stage.status === "Completed";
                  const isNotStarted =
                    stage.status === "NotStarted" ||
                    (!isStarted && !isCompleted);
                  const canStart = canStartStage(stages, stage.order);

                  return (
                    <AccordionItem key={stage.id} value={`stage-${stage.id}`}>
                      <div className="flex items-center justify-between">
                        <AccordionTrigger className="flex-1 hover:no-underline">
                          <div className="flex items-center gap-3">
                            <span
                              className={`h-3 w-3 rounded-full ${getStatusColor(stage.status)}`}
                            />
                            {getStatusIcon(stage.status)}
                            <span>
                              {t("stageLabel", {
                                order: stage.order,
                                title: stage.title,
                              })}
                            </span>
                          </div>
                        </AccordionTrigger>

                        <div className="ml-4 flex gap-2">
                          {isNotStarted && canStart && (
                            <Button
                              onClick={() => startStage(stage.id)}
                              disabled={isStarting}
                              variant="default"
                              size="sm"
                            >
                              {isStarting ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Play className="h-4 w-4" />
                              )}
                              <span className="hidden sm:ml-2 sm:inline">
                                {t("startStage")}
                              </span>
                            </Button>
                          )}

                          {isNotStarted && !canStart && (
                            <Button disabled variant="outline" size="sm">
                              <Lock className="h-4 w-4" />
                              <span className="hidden sm:ml-2 sm:inline">
                                {t("stageLockedMessage")}
                              </span>
                            </Button>
                          )}

                          {isStarted && (
                            <Button
                              onClick={() => completeStage(stage.id)}
                              disabled={isCompleting}
                              variant="default"
                              size="sm"
                            >
                              {isCompleting ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <CheckCircle className="h-4 w-4" />
                              )}
                              <span className="hidden sm:ml-2 sm:inline">
                                {t("completeStage")}
                              </span>
                            </Button>
                          )}

                          {isCompleted && (
                            <Button disabled variant="outline" size="sm">
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              <span className="hidden sm:ml-2 sm:inline">
                                {t("stageCompleted")}
                              </span>
                            </Button>
                          )}
                        </div>
                      </div>

                      <AccordionContent className="pl-8">
                        <p className="mb-4">{stage.description}</p>

                        {stage.resources.length > 0 && (
                          <div className="mt-4">
                            <h4 className="mb-3 font-semibold">
                              {t("resourcesLabel")}
                            </h4>
                            <div className="space-y-3">
                              {stage.resources.map(
                                (resource, resourceIndex) => (
                                  <div
                                    key={resourceIndex}
                                    className="bg-muted/50 rounded-lg border p-4"
                                  >
                                    <h5 className="mb-2 font-medium">
                                      {resource.title}
                                    </h5>
                                    {resource.description && (
                                      <p className="text-muted-foreground mb-3 text-sm">
                                        {resource.description}
                                      </p>
                                    )}

                                    {/* URLs Section */}
                                    {parseUrls(resource.urls).length > 0 && (
                                      <div className="mb-3">
                                        <h6 className="mb-2 text-sm font-medium">
                                          {t("linksLabel")}
                                        </h6>
                                        <div className="space-y-2">
                                          {parseUrls(resource.urls).map(
                                            (url, urlIndex) => (
                                              <div
                                                key={urlIndex}
                                                className="flex items-center gap-2"
                                              >
                                                <a
                                                  href={url}
                                                  target="_blank"
                                                  rel="noopener noreferrer"
                                                  className="inline-flex max-w-full items-center gap-1 break-all text-blue-500 hover:underline"
                                                  title={url}
                                                >
                                                  <ExternalLink className="h-3 w-3 flex-shrink-0" />
                                                  <span className="truncate">
                                                    {url}
                                                  </span>
                                                </a>
                                              </div>
                                            ),
                                          )}
                                        </div>
                                      </div>
                                    )}

                                    {/* Files Section */}
                                    {parseFilePaths(resource.filePaths).length >
                                      0 && (
                                      <div>
                                        <h6 className="mb-2 text-sm font-medium">
                                          {t("filesLabel")}
                                        </h6>
                                        <div className="space-y-2">
                                          {parseFilePaths(
                                            resource.filePaths,
                                          ).map((filePath, fileIndex) => (
                                            <div
                                              key={fileIndex}
                                              className="flex items-center gap-2"
                                            >
                                              <a
                                                href={`${API_URL}${filePath}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                download
                                                className="inline-flex max-w-full items-center gap-1 break-all text-blue-500 hover:underline"
                                                title={getFileName(filePath)}
                                              >
                                                <Download className="h-3 w-3 flex-shrink-0" />
                                                <span className="truncate">
                                                  {getFileName(filePath)}
                                                </span>
                                              </a>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                ),
                              )}
                            </div>
                          </div>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
