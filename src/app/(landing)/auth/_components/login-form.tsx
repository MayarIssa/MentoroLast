"use client";

import { login } from "@/server/actions/auth";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { Spinner } from "@/components/spinner";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .max(100, { message: "Password must not exceed 100 characters" }),
  "remember-me": z.boolean().default(false).optional(),
});

const LoginForm = ({
  className,
  switchToResetPassword,
}: {
  className?: string;
  switchToResetPassword: () => void;
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      "remember-me": false,
    },
  });
  const t = useTranslations("Auth.login");

  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const data = await login(values.email, values.password);

    if (!data) {
      form.setError("root", {
        type: "manual",
        message: "Invalid credentials",
      });
      return;
    }

    // Save the token to localStorage
    if (data.token) {
      localStorage.setItem("mentoro-token", data.token);
      console.log("Token saved to localStorage:", data.token);
    } else {
      console.error("No token received from login response.");
      form.setError("root", {
        type: "manual",
        message: "Login failed. Please try again.",
      });
      return;
    }

    // Redirect to the dashboard based on the role (default to student)
    const role = data.role.toLowerCase() ?? "student";
    router.replace(`/${role}-dashboard`);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("space-y-8 px-4 py-6", className)} // Added padding to ensure content fits well
      >
        {form.formState.errors.root && (
          <div className="text-center text-sm font-medium text-red-500">
            {form.formState.errors.root.message}
          </div>
        )}

        {/* Added a wrapper div with margin-top to push email, password, and button lower */}
        <div className="space-y-8">
          {" "}
          {/* Adjusted spacing for better fit */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input type="email" placeholder="Email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input type="password" placeholder="Password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-col items-center justify-between gap-4 lg:flex-row">
            <FormField
              control={form.control}
              name="remember-me"
              render={({ field }) => (
                <FormItem className="flex items-center space-y-0 space-x-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="leading-none">
                    <FormLabel>{t("rememberMe")}</FormLabel>
                  </div>
                </FormItem>
              )}
            />
            <Button
              type="button"
              variant="link"
              onClick={switchToResetPassword}
              className="text-muted-foreground"
            >
              {t("forgotPassword")}
            </Button>
          </div>
          <Button
            className="w-full rounded-xl rounded-br-none font-bold"
            type="submit"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting && <Spinner />}
            {t("submit")}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default LoginForm;
