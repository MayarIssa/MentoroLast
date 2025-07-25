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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { API } from "@/lib/api";
import { tryCatch } from "@/lib/utils/try-catch";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useTranslations } from "next-intl";

const requestMentorSchema = z.object({
  plan: z.enum(["Customized", "Consultant", "Roadmap"]),
  goal: z.string().min(1, { message: "goal_required" }),
});
export type RequestMentorFormValues = z.infer<typeof requestMentorSchema>;

export default function RequestMentorForm({
  mentorId,
  onSuccess,
}: {
  mentorId: string;
  onSuccess: () => void;
}) {
  const t = useTranslations("RequestMentorForm");

  const form = useForm<RequestMentorFormValues>({
    resolver: zodResolver(requestMentorSchema),
    defaultValues: {
      plan: "Customized",
      goal: "",
    },
  });

  async function onSubmit(values: RequestMentorFormValues) {
    const response = await tryCatch(
      API.mutations.mentors.requestMentor(mentorId, values),
    );
    if (response.error) {
      toast.error(t("error_toast"));
      return;
    }

    toast.success(t("success_toast"));
    onSuccess();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="plan"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("plan_label")}</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={t("plan_placeholder")} />
                    </SelectTrigger>
                  </FormControl>
                  <FormMessage />
                  <SelectContent>
                    <SelectItem value="Customized">{t("plan_options.customized")}</SelectItem>
                    <SelectItem value="Consultant">{t("plan_options.consultant")}</SelectItem>
                    <SelectItem value="Roadmap">{t("plan_options.roadmap")}</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="goal"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("goal_label")}</FormLabel>
              <FormControl>
                <Input placeholder={t("goal_placeholder")} {...field} />
              </FormControl>
              <FormMessage>{t("goal_required")}</FormMessage>
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? <Spinner /> : <Send />}
          {t("submit_button")}
        </Button>
      </form>
    </Form>
  );
}