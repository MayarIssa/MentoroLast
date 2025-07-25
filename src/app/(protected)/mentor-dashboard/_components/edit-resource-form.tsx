"use client";

import { FormFileUploader } from "@/components/form-file-uploader";
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
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, Trash } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { API } from "@/lib/api";
import { tryCatch } from "@/lib/utils/try-catch";
import { useParams, useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import type { useTranslations as useTranslationsType } from "next-intl";

function getEditResourceFormSchema(
  t: ReturnType<typeof useTranslationsType<"Resources.EditResourceForm">>,
) {
  return z.object({
    title: z.string().min(1, { message: t("validation.titleRequired") }),
    description: z
      .string()
      .min(1, { message: t("validation.descriptionRequired") }),
    files: z.array(z.instanceof(File).optional()).optional(),
    links: z
      .array(
        z.object({
          value: z
            .string()
            .min(1, { message: t("validation.linkRequired") })
            .url({
              message: t("validation.invalidLink"),
            }),
        }),
      )
      .optional(),
  });
}

export function EditResourceForm({
  defaultValues,
}: {
  defaultValues: Omit<
    z.infer<ReturnType<typeof getEditResourceFormSchema>>,
    "files"
  > & {
    files: string[];
  };
}) {
  const t = useTranslations("Resources.EditResourceForm");
  const isArabic = useLocale().startsWith("ar");
  const EditResourceFormSchema = getEditResourceFormSchema(t);

  const form = useForm<z.infer<typeof EditResourceFormSchema>>({
    resolver: zodResolver(EditResourceFormSchema),
    defaultValues: {
      title: defaultValues.title,
      description: defaultValues.description,
      files: [],
      links: defaultValues.links,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "links",
  });

  const { resourceId } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();

  async function onSubmit(values: z.infer<typeof EditResourceFormSchema>) {
    const formData = new FormData();
    formData.append("Id", resourceId as string);
    formData.append("Title", values.title);
    formData.append("Description", values.description);

    values.files?.forEach((file) => {
      if (!file) return;
      formData.append("Files", file);
    });
    values.links?.forEach((link, idx) => {
      formData.append(`Urls[${idx}]`, link.value);
    });

    const { error: editResourceError } = await tryCatch(
      API.mutations.resources.editResource(formData),
    );

    if (editResourceError) {
      toast.error(t("errorToast"));
      return;
    }

    await queryClient.invalidateQueries({ queryKey: ["resources"] });
    router.push(`/mentor-dashboard/resources/${String(resourceId)}`);
    toast.success(t("successToast"));
  }

  return (
    <Form {...form}>
      <form
        dir={isArabic ? "rtl" : "ltr"}
        onSubmit={async (e) => {
          e.stopPropagation();
          await form.handleSubmit(onSubmit)(e);
        }}
        className="space-y-4"
      >
        <ScrollArea
          dir={isArabic ? "rtl" : "ltr"}
          className="h-[calc(100svh-300px)]"
        >
          <div
            className={cn(
              "space-y-4 py-4",
              isArabic ? "pr-1 pl-4" : "pr-4 pl-1",
            )}
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground text-xl font-bold">
                    {t("titleLabel")}
                  </FormLabel>
                  <FormControl>
                    <Input placeholder={t("titlePlaceholder")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    className={`text-foreground text-xl font-bold ${
                      isArabic
                        ? "force-text-right block"
                        : "force-text-left block"
                    }`}
                  >
                    {t("descriptionLabel")}
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t("descriptionPlaceholder")}
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {defaultValues.files.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-md border-2 border-dashed p-24">
                <Spinner />
                <p
                  className={`text-muted-foreground text-sm ${
                    isArabic ? "force-text-right" : "force-text-left"
                  }`}
                >
                  {t("loadingFiles")}
                </p>
              </div>
            ) : (
              <FormFileUploader
                name="files"
                dir={isArabic ? "rtl" : "ltr"}
                label={t("resourceFileLabel")}
                control={form.control}
              />
            )}

            <div className="space-y-4">
              <h4
                className={`text-foreground text-3xl font-bold ${
                  isArabic ? "force-text-right" : "force-text-left"
                }`}
              >
                {t("linksSection")}
              </h4>
              {fields.map((field, index) => (
                <FormField
                  key={field.id}
                  control={form.control}
                  name={`links.${index}.value`}
                  render={({ field }) => (
                    <div className="flex items-center gap-4">
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input
                            placeholder={t("linkPlaceholder", {
                              index: index + 1,
                            })}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>

                      <Button
                        size="icon"
                        variant="destructive"
                        onClick={() => remove(index)}
                      >
                        <Trash size={16} />
                      </Button>
                    </div>
                  )}
                />
              ))}

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => append({ value: "" })}
              >
                <Plus />
                {t("addLinkButton")}
              </Button>
            </div>
          </div>
        </ScrollArea>
        <Button
          type="submit"
          className="w-full"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting && <Spinner />}
          {t("submitButton")}
        </Button>
      </form>
    </Form>
  );
}
