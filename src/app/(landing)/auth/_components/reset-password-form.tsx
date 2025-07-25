"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { checkEmailExists } from "../actions/check-email-exists";
import { toast } from "sonner";
import { SendResetPasswordEmail } from "../actions/send-reset-password-email";
import { tryCatch } from "@/lib/utils/try-catch";

const ResetPasswordFormSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
});

export function ResetPasswordForm({
  switchToLoginAction,
}: {
  switchToLoginAction: () => void;
}) {
  const form = useForm<z.infer<typeof ResetPasswordFormSchema>>({
    resolver: zodResolver(ResetPasswordFormSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof ResetPasswordFormSchema>) => {
    const emailExists = await checkEmailExists(values.email);
    if (!emailExists) {
      toast.error("Email does not exist");
      return;
    }

    const { error } = await tryCatch(SendResetPasswordEmail(values.email));
    if (error) {
      toast.error("Something went wrong");
      return;
    }

    toast.success("Reset password email sent successfully");
  };

  return (
    <div className="flex flex-col items-center gap-8">
      <h2 className="text-2xl font-bold">Send a reset link via email</h2>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-8"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">
            Reset Password
          </Button>
        </form>
      </Form>

      <Button variant="link" onClick={switchToLoginAction}>
        Switch to Login
      </Button>
    </div>
  );
}
