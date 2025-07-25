"use client";

import { Spinner } from "@/components/spinner";
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
import { API } from "@/lib/api";
import { tryCatch } from "@/lib/utils/try-catch";
import { zodResolver } from "@hookform/resolvers/zod";
import { SendIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const complaintFormSchema = z.object({
  complaint: z.string().min(1),
});
export type ComplaintFormValues = z.infer<typeof complaintFormSchema>;

export function ComplaintForm() {
  const t = useTranslations("StudentComplaints");
  const form = useForm<ComplaintFormValues>({
    resolver: zodResolver(complaintFormSchema),
    defaultValues: {
      complaint: "",
    },
  });

  async function handleSubmit(data: ComplaintFormValues) {
    const { error } = await tryCatch(
      API.mutations.complaints.createComplaint(data.complaint),
    );
    if (error) {
      toast.error(t("submitError"));
      return;
    }

    toast.success(t("submitSuccess"));
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="complaint"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("complaintLabel")}</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  className="size-auto resize-none"
                  placeholder={t("complaintPlaceholder")}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          className="w-fit self-end"
          type="submit"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? <Spinner /> : <SendIcon />}
          {t("submitButton")}
        </Button>
      </form>
    </Form>
  );
}
