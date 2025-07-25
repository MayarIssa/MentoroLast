"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PencilIcon, SaveIcon } from "lucide-react";
import { ProfileForm, type ProfileFormValues } from "./profile-form";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { tryCatch } from "@/lib/utils/try-catch";
import { API_URL } from "@/lib/constants";
import { toast } from "sonner";
import { Spinner } from "@/components/spinner";
import useAuth from "@/hooks/use-auth";
import { useTranslations } from "next-intl";

export function EditProfileDialog({ profile }: { profile: ProfileFormValues }) {
  const router = useRouter();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const t = useTranslations("Profile.EditProfileDialog");

  function handleSubmit(values: ProfileFormValues) {
    const updateProfile = (values: ProfileFormValues) => {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        formData.append(key, value);
      });

      return fetch(`${API_URL}/api/Account/UpdateStudentProfile`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
        body: formData,
      });
    };

    startTransition(async () => {
      const { data: response, error: responseError } = await tryCatch(
        updateProfile(values),
      );

      if (responseError || !response.ok) {
        toast.error("Failed to update profile");
        return;
      }

      toast.success("Profile updated successfully");
      router.refresh();
      setOpen(false);
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          {t("trigger")}
          <PencilIcon />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>
        <ProfileForm onSubmit={handleSubmit} defaultValues={profile} />
        <DialogFooter>
          <Button type="submit" form="profile-form">
            {isPending ? <Spinner className="text-black" /> : <SaveIcon />}
            {t("save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
