
"use client";

import AddSkillForm from "@/components/add-skill-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlusCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslations } from "next-intl";

export function Skills() {
  const t = useTranslations("Profile.Skills");

  return (
    <Card className="bg-background dark:bg-gray-background rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-extrabold text-shadow">{t("title")}</h3>
          <Dialog>
            <DialogTrigger asChild>
              <PlusCircle
                size={40}
                className="text-primary cursor-pointer"
              />
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-3xl font-bold">
                  {t("addSkill")}
                </DialogTitle>
              </DialogHeader>
              <AddSkillForm />
            </DialogContent>
          </Dialog>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          {/* {user.skills.map((skill) => (
            <div
              key={skill}
              className="px-4 py-2 font-bold text-center min-w-32 bg-background/50 dark:bg-gray-background/50 border border-gray-200 dark:border-gray-700 shadow-md rounded-full rounded-bl-none"
            >
              {skill}
            </div>
          ))} */}
        </div>
      </CardContent>
    </Card>
  );
}
