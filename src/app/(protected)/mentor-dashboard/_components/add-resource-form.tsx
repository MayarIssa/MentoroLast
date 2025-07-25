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
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import type { useTranslations as useTranslationsType } from "next-intl";

function getAddResourceFormSchema(
  t: ReturnType<typeof useTranslationsType<"Resources.AddResourceForm">>,
) {
  return z.object({
    title: z.string().min(1, { message: t("validation.titleRequired") }),
    description: z
      .string()
      .min(1, { message: t("validation.descriptionRequired") }),
    files: z
      .array(z.instanceof(File))
      .min(1, { message: t("validation.fileRequired") })
      .optional(),
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

export function AddResourceForm({ closeDialog }: { closeDialog?: () => void }) {
  const t = useTranslations("Resources.AddResourceForm");

  const AddResourceFormSchema = getAddResourceFormSchema(t);

  const form = useForm<z.infer<typeof AddResourceFormSchema>>({
    resolver: zodResolver(AddResourceFormSchema),
    defaultValues: {
      title: "",
      description: "",
      files: [],
      links: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "links",
  });

  const router = useRouter();
  const queryClient = useQueryClient();

  async function onSubmit(values: z.infer<typeof AddResourceFormSchema>) {
    const formData = new FormData();
    formData.append("Title", values.title);
    formData.append("Description", values.description);

    values.files?.forEach((file) => {
      formData.append("Files", file);
    });
    values.links?.forEach((link, idx) => {
      formData.append(`Urls[${idx}]`, link.value);
    });

    const { error: createResourceError } = await tryCatch(
      API.mutations.resources.addResource(formData),
    );

    if (createResourceError) {
      toast.error(t("errorToast"));
      return;
    }

    await queryClient.invalidateQueries({ queryKey: ["resources"] });

    if (!closeDialog) {
      router.push("/mentor-dashboard/resources");
    } else {
      closeDialog();
    }

    toast.success(t("successToast"));
  }

  return (
    <Form {...form}>
      <form
        onSubmit={async (e) => {
          e.stopPropagation();
          console.log("ERRORS", form.formState.errors);
          await form.handleSubmit(onSubmit)(e);
        }}
        className="space-y-4"
      >
        <ScrollArea className="h-[500px]">
          <div className="space-y-4 py-4 pr-4 pl-1">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
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
                  <FormLabel>{t("descriptionLabel")}</FormLabel>
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

            <FormFileUploader
              name="files"
              label={t("resourceFileLabel")}
              control={form.control}
            />

            <div className="space-y-4">
              <h4 className="text-lg font-semibold">{t("linksSection")}</h4>
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
