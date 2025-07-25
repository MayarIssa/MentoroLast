"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { X } from "lucide-react";
import { API } from "@/lib/api";
import { useTranslations } from "next-intl";

interface RejectFormProps {
  requestId: number;
}

export function RejectForm({ requestId }: RejectFormProps) {
  const t = useTranslations("RejectForm");
  const router = useRouter();
  const [isRejecting, setIsRejecting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const rejectFormSchema = z.object({
    note: z.string().min(10, t("reason_validation")),
  });

  type RejectFormValues = z.infer<typeof rejectFormSchema>;

  const form = useForm<RejectFormValues>({
    resolver: zodResolver(rejectFormSchema),
    defaultValues: {
      note: "",
    },
  });

  const handleReject = async (values: RejectFormValues) => {
    setIsRejecting(true);
    try {
      await API.mutations.admin.rejectPaymentRequest(requestId, values.note);
      toast.success(t("success_toast"));
      setIsDialogOpen(false);
      form.reset();
      router.refresh();
    } catch (error) {
      toast.error(t("error_toast"));
      console.error("Error rejecting payment request:", error);
    } finally {
      setIsRejecting(false);
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    form.reset();
  };

  return (
    <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="bg-red-600 hover:bg-red-700">
          <X className="mr-2 h-4 w-4" />
          {t("reject_button")}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="sm:max-w-[425px]">
        <AlertDialogHeader>
          <AlertDialogTitle>{t("dialog_title")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("dialog_description")}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleReject)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("reason_label")}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t("reason_placeholder")}
                      className="min-h-[100px] resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <AlertDialogFooter>
              <AlertDialogCancel type="button" onClick={handleDialogClose}>
                {t("cancel_button")}
              </AlertDialogCancel>
              <Button
                type="submit"
                disabled={isRejecting}
                variant="destructive"
              >
                {isRejecting ? t("rejecting_button") : t("reject_final_button")}
              </Button>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
