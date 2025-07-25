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
    <Card className="border-border rounded-xl transition-all duration-300 shadow-lg">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-extrabold text-foreground">{t("title")}</h3>
          <Dialog>
            <DialogTrigger asChild>
              <PlusCircle
                size={40}
                className="text-primary cursor-pointer transition hover:opacity-70"
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
              className="px-4 py-2 font-bold text-center min-w-32 bg-primary/10 border border-primary/50 shadow-sm rounded-full rounded-bl-none text-foreground"
            >
              {skill}
            </div>
          ))} */}
        </div>
      </CardContent>
    </Card>
  );
}