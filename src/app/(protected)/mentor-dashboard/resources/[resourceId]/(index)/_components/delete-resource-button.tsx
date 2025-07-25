"use client";

import { API } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
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
import { Trash } from "lucide-react";
import { Spinner } from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

export function DeleteResourceButton({ resourceId }: { resourceId: number }) {
  const t = useTranslations("Resources");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  async function handleDelete() {
    startTransition(async () => {
      await API.mutations.resources.deleteResource(resourceId);
      router.push("/mentor-dashboard/resources");
    });
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">
          <Trash />
          {t("DeleteResourceButton.deleteButton")}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {t("DeleteResourceButton.dialogTitle")}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {t("DeleteResourceButton.dialogDescription")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>
            {t("DeleteResourceButton.cancelButton")}
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={isPending}>
            {isPending ? (
              <>
                <Spinner />
                {t("DeleteResourceButton.deleting")}
              </>
            ) : (
              t("DeleteResourceButton.deleteAction")
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
