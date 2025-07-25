"use client";

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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const profileFormSchema = z.object({
  Name: z.string().min(1),
  Image: z.instanceof(File).optional(),
  About: z.string().min(1),
  Location: z.string().min(1),
  Github: z.string().min(1),
});
export type ProfileFormValues = z.infer<typeof profileFormSchema>;

export function ProfileForm({
  onSubmit,
  defaultValues,
}: {
  onSubmit: (values: ProfileFormValues) => void;
  defaultValues?: ProfileFormValues;
}) {
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: defaultValues ?? {
      Name: "",
      About: "",
      Location: "",
      Github: "",
    },
  });

  return (
    <Form {...form}>
      <form
        id="profile-form"
        className="space-y-8"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="Name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="About"
          render={({ field }) => (
            <FormItem>
              <FormLabel>About</FormLabel>
              <FormControl>
                <Textarea {...field} className="resize-none" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="Location"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Location" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="Github"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Github Profile Link" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="Image"
          render={({ field: { onChange, value: _value, ...field } }) => (
            <FormItem>
              <FormControl>
                <Input
                  type="file"
                  accept={ACCEPTED_IMAGE_TYPES.join(",")}
                  onChange={(e) => {
                    onChange(e.target.files ? e.target.files[0] : null);
                  }}
                  {...field}
                />
              </FormControl>
              <FormDescription>Upload a new profile picture</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
