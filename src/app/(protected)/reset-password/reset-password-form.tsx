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
import { tryCatch } from "@/lib/utils/try-catch";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { resetPassword } from "./actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const ResetPasswordFormSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .max(100, { message: "Password must not exceed 100 characters" })
      .regex(/^(?=.*[A-Z]).*$/, {
        message: "Password must contain 1 Uppercase letter at least",
      })
      .regex(/^(?=.*[!@#$%^&*(),.?":{}|<>~_\-+=\\/[\]]).*$/, {
        message: "Password must contain 1 special character at least",
      }),

    confirmNewPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .max(100, { message: "Password must not exceed 100 characters" })
      .regex(/^(?=.*[A-Z]).*$/, {
        message: "Password must contain 1 Uppercase letter at least",
      })
      .regex(/^(?=.*[!@#$%^&*(),.?":{}|<>~_\-+=\\/[\]]).*$/, {
        message: "Password must contain 1 special character at least",
      }),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords don't match",
    path: ["confirmNewPassword"],
  });

export function ResetPasswordForm({
  token,
  email,
}: {
  token: string;
  email: string;
}) {
  const form = useForm<z.infer<typeof ResetPasswordFormSchema>>({
    resolver: zodResolver(ResetPasswordFormSchema),
    defaultValues: {
      newPassword: "",
      confirmNewPassword: "",
    },
  });
  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof ResetPasswordFormSchema>) => {
    const { error } = await tryCatch(
      resetPassword(email, token, values.newPassword),
    );

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Password reset successfully");
    router.replace("/");
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="New Password" type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmNewPassword"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder="Confirm New Password"
                  type="password"
                  {...field}
                />
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
  );
}
