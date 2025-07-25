"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button, buttonVariants } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ACCEPTED_IMAGE_TYPES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { User, Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { registerStudent } from "@/server/actions/auth";
import { checkEmailExists } from "../actions/check-email-exists";
import { Spinner } from "@/components/spinner";
import { tryCatch } from "@/lib/utils/try-catch";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

export const RegisterFormSchema = z
  .object({
    picture: z.instanceof(File).refine((file) => file, {
      message: "Picture is required.",
    }),
    firstName: z.string().min(2, { message: "First name is required" }),
    lastName: z.string().min(2, { message: "Last name is required" }),
    email: z.string().email({ message: "Invalid email address." }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .max(100, { message: "Password must not exceed 100 characters" })
      .regex(/^(?=.*[A-Z]).*$/, {
        message: "Password must contain 1 Uppercase letter at least",
      })
      .regex(/^(.*[!@#$%^&*(),.?":{}|<>~_\-+=\\/[\]]).*$/, {
        message: "Password must contain 1 special character at least",
      }),
    agreeTOS: z.boolean().optional(),
    confirmPassword: z
      .string()
      .min(6, { message: "Confirm password must match password." }),
    location: z.string().min(2, { message: "Location is required" }),
    about: z.string().optional(),
    linkedIn: z.string().min(2, { message: "LinkedIn is required" }),
    github: z.string().min(2, { message: "Github is required" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
  });

const RegisterForm = ({
  className,
  switchToMentorRegister,
}: {
  className?: string;
  switchToMentorRegister: () => void;
}) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State for confirm password visibility
  const router = useRouter();
  const t = useTranslations("Auth.register");

  const form = useForm<z.infer<typeof RegisterFormSchema>>({
    resolver: zodResolver(RegisterFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      location: "",
      about: "",
      agreeTOS: false,
      linkedIn: "",
      github: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof RegisterFormSchema>) => {
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      picture,
      about,
      location,
      linkedIn,
      github,
    } = values;

    // Check if email exists
    const emailExists = await checkEmailExists(email);
    if (emailExists) {
      toast.error(t("errors.emailExists"));
      return;
    }

    const fullName = `${firstName}${lastName}`;

    const registerData = new FormData();
    registerData.append("Name", fullName);
    registerData.append("Email", email);
    registerData.append("Password", password);
    registerData.append("ConfirmPassword", confirmPassword);
    registerData.append("Image", picture as Blob);
    registerData.append("About", about ?? "");
    registerData.append("Location", location);
    registerData.append("Linkedin", `Linkedin/${linkedIn}`);
    registerData.append("Github", `Github/${github}`);
    registerData.append("Role", "Student");

    const { data, error: registerError } = await tryCatch(
      registerStudent(registerData),
    );

    if (registerError) {
      toast.error(t("errors.registerFailed"));
      return;
    }

    if (data) {
      toast.success(t("success.registerSuccess"));
      router.push(`/${data.role.toLowerCase()}-dashboard`);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setPreview(null);
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  // Toggle confirm password visibility
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={cn("space-y-8", className)}
        >
          <FormField
            control={form.control}
            name="picture"
            render={({ field: { onChange, value, ...field } }) => (
              <div className="flex items-center gap-4">
                <div className="size-32 overflow-hidden rounded-xl">
                  {preview && value ? (
                    <Image
                      src={preview}
                      alt={t("pictureAlt")}
                      className="size-full object-cover"
                      width={0}
                      height={0}
                      sizes="100vw"
                    />
                  ) : (
                    <div className="size-full bg-gray-200 object-cover">
                      <User className="size-full stroke-gray-400" />
                    </div>
                  )}
                </div>
                <FormItem>
                  <FormLabel>{t("pictureLabel")}</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept={ACCEPTED_IMAGE_TYPES.join(",")}
                      onChange={(e) => {
                        onChange(e.target.files ? e.target.files[0] : null);
                        handleFileChange(e);
                      }}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>{t("pictureDescription")}</FormDescription>
                  <FormMessage />
                </FormItem>
              </div>
            )}
          />
          <div className="grid grid-cols-2 gap-8">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder={t("firstNamePlaceholder")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder={t("lastNamePlaceholder")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="email"
                    placeholder={t("emailPlaceholder")}
                    {...field}
                  />
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
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder={t("passwordPlaceholder")}
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder={t("confirmPasswordPlaceholder")}
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={toggleConfirmPasswordVisibility}
                      className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      aria-label={
                        showConfirmPassword
                          ? "Hide confirm password"
                          : "Show confirm password"
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder={t("locationPlaceholder")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="about"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("aboutLabel")}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder={t("aboutPlaceholder")}
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="linkedIn"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder={t("linkedInPlaceholder")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="github"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder={t("githubPlaceholder")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-col items-center justify-between gap-4 lg:flex-row">
            <FormField
              control={form.control}
              name="agreeTOS"
              render={({ field }) => (
                <FormItem className="flex items-center space-y-0 space-x-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>{t("acceptTerms")}</FormLabel>
                  </div>
                </FormItem>
              )}
            />
            <Link
              href="#"
              className={cn(
                buttonVariants({ variant: "link" }),
                "text-muted-foreground",
              )}
            >
              {t("forgotPassword")}
            </Link>
          </div>
          <Button
            className="w-full"
            type="submit"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? (
              <>
                <Spinner className="size-4" /> {t("submit")}
              </>
            ) : (
              t("submit")
            )}
          </Button>
        </form>
      </Form>
      <Button variant="link" onClick={switchToMentorRegister}>
        {t("becomeMentor")}
      </Button>
    </div>
  );
};

export default RegisterForm;
