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
import { DEMO_ACCOUNTS, DEMO_MODE } from "@/lib/demo/config";
import { GraduationCap, ShieldCheck, Users } from "lucide-react";
import { useState } from "react";

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
  const [demoRole, setDemoRole] = useState<keyof typeof DEMO_ACCOUNTS | null>(
    null,
  );

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

  const loginAsDemo = async (role: keyof typeof DEMO_ACCOUNTS) => {
    setDemoRole(role);
    form.setValue("email", DEMO_ACCOUNTS[role].email);
    form.setValue("password", DEMO_ACCOUNTS[role].password);
    await onSubmit(DEMO_ACCOUNTS[role]);
  };

  const demoOptions = [
    { role: "student" as const, label: t("demoStudent"), Icon: GraduationCap },
    { role: "mentor" as const, label: t("demoMentor"), Icon: Users },
    { role: "admin" as const, label: t("demoAdmin"), Icon: ShieldCheck },
  ];

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
          {DEMO_MODE && (
            <div className="space-y-3 rounded-xl border border-dashed p-4">
              <p className="text-muted-foreground text-center text-sm font-medium">
                {t("demoTitle")}
              </p>
              <div className="grid grid-cols-3 gap-2">
                {demoOptions.map(({ role, label, Icon }) => (
                  <Button
                    key={role}
                    type="button"
                    variant="outline"
                    className="flex h-auto flex-col gap-1 py-3"
                    disabled={form.formState.isSubmitting || demoRole !== null}
                    onClick={() => void loginAsDemo(role)}
                  >
                    {demoRole === role ? (
                      <Spinner />
                    ) : (
                      <Icon className="size-5" />
                    )}
                    <span className="text-xs font-semibold">{label}</span>
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </form>
    </Form>
  );
};

export default LoginForm;
