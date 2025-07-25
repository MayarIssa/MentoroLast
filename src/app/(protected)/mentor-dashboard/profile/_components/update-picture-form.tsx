"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
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
import { cn } from "@/lib/utils";
import { useState } from "react";
import { User } from "lucide-react";
import Image from "next/image";
import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE } from "@/lib/constants";
import { useTranslations } from "next-intl";

const formSchema = z.object({
  picture: z
    .instanceof(File, { message: "Profile.UpdatePictureForm.errors.fileRequired" })
    .refine((file) => file.type.includes("image"), "Profile.UpdatePictureForm.errors.imageRequired")
    .refine((files) => files.size <= MAX_FILE_SIZE, "Profile.UpdatePictureForm.errors.maxSize")
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Profile.UpdatePictureForm.errors.format"
    ),
});

const UpdatePictureForm = ({ className }: { className?: string }) => {
  const t = useTranslations("Profile.UpdatePictureForm");
  const [preview, setPreview] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);
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

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("space-y-8 px-2", className)}
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
                    alt="Preview"
                    className="size-full object-cover"
                    width={0}
                    height={0}
                    sizes="100vw"
                  />
                ) : (
                  <div className="size-full bg-gray-background object-cover">
                    <User className="size-full stroke-gray-foreground" />
                  </div>
                )}
              </div>
              <FormItem>
                <FormLabel className="text-foreground">{t("label")}</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept={ACCEPTED_IMAGE_TYPES.join(",")}
                    onChange={(e) => {
                      onChange(e.target.files?.[0]);
                      handleFileChange(e);
                    }}
                    {...field}
                    className="bg-background text-foreground border-input"
                  />
                </FormControl>
                <FormDescription className="text-muted-foreground">{t("description")}</FormDescription>
                <FormMessage />
              </FormItem>
            </div>
          )}
        />
        <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90" type="submit">
          {t("submit")}
        </Button>
      </form>
    </Form>
  );
};

export default UpdatePictureForm;