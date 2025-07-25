"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Book,
  FileText,
  ExternalLink,
  Package,
  Download,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { API } from "@/lib/api";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useTranslations } from "next-intl";

export function AssignedResourcesDialog({
  studentId,
  trigger,
}: {
  studentId: number;
  trigger?: React.ReactNode;
}) {
  const t = useTranslations("AllStudents.AssignedResourcesDialog");
  const queryClient = useQueryClient();
  const [isDeleting, setIsDeleting] = useState<number | null>(null);

  const { data: resources = [], isLoading } = useQuery({
    queryKey: ["mentor-assigned-resources"],
    queryFn: () => API.queries.resources.getMentorAssignedResources(),
  });

  const studentResources = resources.filter(
    (resource) => resource.studentId === studentId,
  );

  async function handleUnassign(resourceId: number) {
    setIsDeleting(resourceId);
    try {
      const success = await API.mutations.resources.unassignResource(
        resourceId,
        studentId,
      );

      if (success) {
        toast.success(t("unassign_success"));
        void queryClient.invalidateQueries({
          queryKey: ["mentor-assigned-resources"],
        });
      } else {
        toast.error(t("unassign_error"));
      }
    } catch (error) {
      toast.error(t("unassign_error"));
      console.error("Error unassigning resource:", error);
    } finally {
      setIsDeleting(null);
    }
  }

  if (isLoading) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant={"outline"}>
            <Book />
            {t("button")}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              {t("title")}
            </DialogTitle>
            <DialogDescription>{t("description")}</DialogDescription>
          </DialogHeader>
          <div className="py-8 text-center">{t("loading")}</div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button variant={"outline"}>
            <Book />
            {t("button")}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            {t("title")}
          </DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(100vh-300px)]">
          <div className="space-y-4">
            {studentResources.length === 0 ? (
              <div className="text-muted-foreground py-8 text-center">
                <Package className="mx-auto mb-4 h-12 w-12 opacity-50" />
                <p>{t("no_resources")}</p>
              </div>
            ) : (
              studentResources.map((resource) => (
                <Card key={resource.resourceId} className="w-full">
                  <CardHeader>
                    <CardTitle className="flex items-start justify-between">
                      <span className="text-lg">{resource.resourceTitle}</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="ml-2">
                          {t("resource_id", { id: resource.resourceId })}
                        </Badge>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="destructive"
                              size="sm"
                              disabled={isDeleting === resource.resourceId}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                {t("unassign_title")}
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                {t("unassign_description")}
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>
                                {t("cancel")}
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() =>
                                  void handleUnassign(resource.resourceId)
                                }
                                disabled={isDeleting === resource.resourceId}
                              >
                                {isDeleting === resource.resourceId
                                  ? t("unassigning")
                                  : t("unassign_button")}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </CardTitle>
                    {resource.resourceDescription && (
                      <CardDescription className="text-sm leading-relaxed">
                        {resource.resourceDescription}
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Files Section */}
                    {resource.files && resource.files.length > 0 && (
                      <div>
                        <div className="mb-2 flex items-center gap-2">
                          <FileText className="text-muted-foreground h-4 w-4" />
                          <h4 className="text-sm font-medium">
                            {t("files_section")}
                          </h4>
                          <Badge variant="outline" className="text-xs">
                            {resource.files.length}
                          </Badge>
                        </div>
                        <div className="grid gap-2">
                          {resource.files.map((file, index) => (
                            <div
                              key={index}
                              className="bg-muted/50 flex items-center gap-2 rounded-md p-2 text-sm"
                            >
                              <Download className="text-muted-foreground h-3 w-3 flex-shrink-0" />
                              <a
                                href={file}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary min-w-0 flex-1 truncate hover:underline"
                                title={file}
                              >
                                {t("download", {
                                  filename: file.split("_").pop() ?? "",
                                })}
                              </a>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* URLs Section */}
                    {resource.urls && resource.urls.length > 0 && (
                      <div>
                        <div className="mb-2 flex items-center gap-2">
                          <ExternalLink className="text-muted-foreground h-4 w-4" />
                          <h4 className="text-sm font-medium">
                            {t("urls_section")}
                          </h4>
                          <Badge variant="outline" className="text-xs">
                            {resource.urls.length}
                          </Badge>
                        </div>
                        <div className="grid gap-2">
                          {resource.urls.map((url, index) => (
                            <div
                              key={index}
                              className="bg-muted/50 flex items-center gap-2 overflow-hidden rounded-md p-2 text-sm"
                            >
                              <ExternalLink className="text-muted-foreground h-3 w-3 flex-shrink-0" />
                              <a
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary min-w-0 flex-1 truncate hover:underline"
                                title={url}
                              >
                                {url.slice(0, 30)}...
                              </a>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* No Files or URLs Message */}
                    {(!resource.files || resource.files.length === 0) &&
                      (!resource.urls || resource.urls.length === 0) && (
                        <div className="text-muted-foreground py-4 text-center text-sm">
                          {t("no_files_urls")}
                        </div>
                      )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
