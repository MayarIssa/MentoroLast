"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
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
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { User, Eye, EyeOff } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ACCEPTED_DOC_TYPES,
  ACCEPTED_IMAGE_TYPES,
  ACCEPTED_VIDEO_TYPES,
  CATEGORIES,
  MAX_FILE_SIZE,
} from "@/lib/constants";
import { registerMentor } from "@/server/actions/auth";
import { tryCatch } from "@/lib/utils/try-catch";
import { toast } from "sonner";
import { Spinner } from "@/components/spinner";
import { checkEmailExists } from "../actions/check-email-exists";
import { useTranslations } from "next-intl";

const formSchema = z
  .object({
    picture: z
      .instanceof(File)
      .refine((file) => file, {
        message: "Picture is required.",
      })
      .refine((file) => file?.size <= MAX_FILE_SIZE, "Max file size is 23MB.")
      .refine(
        (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
        "Only .jpg, .jpeg, .png and .webp formats are supported.",
      ),
    firstName: z.string().min(2, { message: "First name is required" }),
    lastName: z.string().min(2, { message: "Last name is required" }),
    email: z.string().email({ message: "Invalid email address." }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .max(100, { message: "Password must not exceed 100 characters" })
      .regex(/^(?=.*[A-Z]).*$/, {
        message: "Password must contain at least 1 uppercase letter",
      })
      .regex(/^(?=.*[!@#$%^&*(),.?":{}|<>~_\-+=\\/[\]]).*$/, {
        message: "Password must contain at least 1 special character",
      }),
    confirmPassword: z
      .string()
      .min(6, { message: "Confirm password must match password." }),
    location: z.string().min(2, { message: "Location is required" }),
    jobTitle: z.string().min(2, { message: "Job Title is required" }),
    category: z.string().min(2, { message: "Category is required" }),
    accountBank: z.string().min(2, { message: "Account Bank is required" }),
    cv: z
      .instanceof(File)
      .refine((file) => file, "CV is required.")
      .refine((file) => file?.size <= MAX_FILE_SIZE, "Max file size is 23MB.")
      .refine(
        (file) => ACCEPTED_DOC_TYPES.includes(file?.type),
        "Only .pdf format is supported.",
      ),
    video: z
      .instanceof(File)
      .refine((file) => file, "A Video is required.")
      .refine((file) => file?.size <= MAX_FILE_SIZE, "Max file size is 23MB.")
      .refine(
        (file) => ACCEPTED_VIDEO_TYPES.includes(file?.type),
        "Only .mp4 format is supported.",
      ),
    about: z.string().optional(),
    linkedIn: z.string().min(2, { message: "LinkedIn is required" }),
    github: z.string().min(2, { message: "GitHub is required" }),
    agreeTOS: z.boolean().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

const MentorForm = ({
  className,
  switchToRegister,
}: {
  className?: string;
  switchToRegister: () => void;
}) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State for confirm password visibility
  const router = useRouter();
  const t = useTranslations("Auth.register");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      jobTitle: "",
      location: "",
      category: "",
      accountBank: "",
      agreeTOS: false,
      about: "",
      linkedIn: "",
      github: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
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
      jobTitle,
      category,
      accountBank,
      cv,
      video,
    } = values;

    const emailExists = await checkEmailExists(email);
    if (emailExists) {
      toast.error(t("errors.emailExists"));
      return;
    }

    const formData = new FormData();
    const fullName = `${firstName}${lastName}`;
    formData.append("Name", fullName);
    formData.append("Email", email);
    formData.append("Password", password);
    formData.append("ConfirmPassword", confirmPassword);
    formData.append("Image", picture);
    formData.append("About", about ?? "");
    formData.append("Location", location);
    formData.append("Linkedin", `Linkedin/${linkedIn}`);
    formData.append("Github", `Github/${github}`);
    formData.append("JobTitle", jobTitle);
    formData.append("Category", category);
    formData.append("AccountBank", accountBank);
    formData.append("Cv", cv);
    formData.append("IntroVideo", video);
    formData.append("Role", "Mentor");

    const { error: registerError } = await tryCatch(registerMentor(formData));

    if (registerError) {
      toast.error(t("errors.registerFailed"));
      return;
    }

    toast.success(t("success.mentorRequestSuccess"));
    router.push("/");
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
                        onChange(e.target.files?.[0]);
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
            name="accountBank"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder={t("accountBankPlaceholder")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="jobTitle"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder={t("jobTitlePlaceholder")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("categoryLabel")}</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t("categoryPlaceholder")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {CATEGORIES.map((category) => (
                      <SelectItem key={category.name} value={category.name}>
                        <category.Icon className="mr-2 mb-1 inline size-4" />
                        <span>{category.name}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="cv"
            render={({ field: { onChange, value: _value, ...field } }) => (
              <FormItem>
                <FormLabel>{t("cvLabel")}</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept={ACCEPTED_DOC_TYPES.join(",")}
                    onChange={(e) => {
                      onChange(e.target.files?.[0]);
                    }}
                    {...field}
                  />
                </FormControl>
                <FormDescription>{t("cvDescription")}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="video"
            render={({ field: { onChange, value: _value, ...field } }) => (
              <FormItem>
                <FormLabel>{t("videoLabel")}</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept={ACCEPTED_VIDEO_TYPES.join(",")}
                    onChange={(e) => {
                      onChange(e.target.files?.[0]);
                    }}
                    {...field}
                  />
                </FormControl>
                <FormDescription>{t("videoDescription")}</FormDescription>
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
              href="/forgot-password"
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
      <Button variant="link" onClick={switchToRegister}>
        {t("becomeMember")}
      </Button>
    </div>
  );
};

export default MentorForm;
