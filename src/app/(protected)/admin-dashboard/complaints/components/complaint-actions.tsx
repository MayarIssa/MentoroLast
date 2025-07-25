"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, XCircle, Trash2 } from "lucide-react";

const rejectFormSchema = z.object({
  notes: z.string().min(1, "Notes are required for rejection"),
});

type RejectFormValues = z.infer<typeof rejectFormSchema>;

interface ComplaintActionsProps {
  complaintId: number;
  onAccept: (id: number) => Promise<void>;
  onReject: (id: number, notes: string) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

export function ComplaintActions({
  complaintId,
  onAccept,
  onReject,
  onDelete,
}: ComplaintActionsProps) {
  const t = useTranslations("AdminComplaints");
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);

  const form = useForm<RejectFormValues>({
    resolver: zodResolver(rejectFormSchema),
    defaultValues: {
      notes: "",
    },
  });

  const handleReject = async (values: RejectFormValues) => {
    try {
      await onReject(complaintId, values.notes);
      setRejectDialogOpen(false);
      form.reset();
    } catch (error) {
      console.error("Error rejecting complaint:", error);
    }
  };

  return (
    <div className="flex items-center justify-end gap-2">
      <Button
        size="sm"
        variant="outline"
        onClick={() => onAccept(complaintId)}
        className="text-green-600 hover:bg-green-50 hover:text-green-700"
      >
        <CheckCircle className="h-3 w-3" />
        {t("actions.accept_button")}
      </Button>

      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogTrigger asChild>
          <Button
            size="sm"
            variant="outline"
            className="text-orange-600 hover:bg-orange-50 hover:text-orange-700"
          >
            <XCircle className="h-3 w-3" />
            {t("actions.reject_button")}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("actions.reject_dialog_title")}</DialogTitle>
            <DialogDescription>
              {t("actions.reject_dialog_description")}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleReject)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("actions.rejection_notes_label")}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t("actions.rejection_notes_placeholder")}
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setRejectDialogOpen(false);
                    form.reset();
                  }}
                >
                  {t("actions.cancel_button")}
                </Button>
                <Button type="submit" variant="destructive">
                  {t("actions.reject_confirm_button")}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            size="sm"
            variant="outline"
            className="text-red-600 hover:bg-red-50 hover:text-red-700"
          >
            <Trash2 className="h-3 w-3" />
            {t("actions.delete_button")}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t("actions.delete_confirm_title")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t("actions.delete_confirm_description")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("actions.cancel_button")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => onDelete(complaintId)}
              className="bg-red-600 hover:bg-red-700"
            >
              {t("actions.delete_confirm_button")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
