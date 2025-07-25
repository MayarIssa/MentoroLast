"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { useTranslations } from "next-intl";

const formSchema = z.object({
  subject: z.string().min(2, { message: "Profile.SendMessageForm.errors.subjectRequired" }),
  message: z.string().min(2, { message: "Profile.SendMessageForm.errors.messageRequired" }),
});

const SendMessageForm = ({ className }: { className?: string }) => {
  const t = useTranslations("Profile.SendMessageForm");
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subject: "",
      message: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("space-y-8 py-8", className)}
      >
        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder={t("subject")} {...field} className="bg-background text-foreground border-input" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-foreground">{t("message")}</FormLabel>
              <FormControl>
                <Textarea placeholder="" className="resize-none bg-background text-foreground border-input" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90" type="submit">
          {t("submit")}
        </Button>
      </form>
    </Form>
  );
};

export default SendMessageForm;