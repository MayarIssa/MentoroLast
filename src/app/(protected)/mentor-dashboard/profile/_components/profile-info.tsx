"use client";

import SendMessageForm from "@/app/(protected)/mentor-dashboard/profile/_components/send-message-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogHeader,
} from "@/components/ui/dialog";
import { User as UserIcon, Camera, Star, Send } from "lucide-react";
import { useTranslations } from "next-intl";
import type { User } from "@/lib/types";

export function ProfileInfo({ user }: { user: User }) {
  const t = useTranslations("Profile.ProfileInfo");

  return (
    <Card className="border-border rounded-xl shadow-lg transition-all duration-300">
      <CardContent className="flex flex-col items-center gap-8 p-6 md:flex-row">
        <div className="relative">
          <Avatar className="ring-border size-40 ring-2">
            <AvatarFallback>
              <UserIcon className="text-muted-foreground size-full p-8" />
            </AvatarFallback>
            <AvatarImage src={`http://mentorohelp.runasp.net/${user.image}`}  className="w-full" /> 
          </Avatar>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                size="icon"
                className="bg-primary hover:bg-primary/90 text-primary-foreground absolute -right-2 bottom-0 rounded-full"
              >
                <Camera className="size-5" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-3xl font-bold">
                  {t("sendMessage")}
                </DialogTitle>
              </DialogHeader>
              <SendMessageForm />
            </DialogContent>
          </Dialog>
        </div>
        <div className="flex flex-1 flex-col items-center justify-between gap-4 md:items-start">
          <div className="text-center md:text-start">
            <h2 className="text-foreground bg-clip-text text-3xl font-extrabold">
              {user.name}
            </h2>
            <p className="text-foreground text-xl font-bold">{user.role}</p>
            <p className="text-muted-foreground flex items-center justify-center gap-2 text-sm font-semibold md:justify-start">
              <Star className="fill-accent size-5" /> 5.0 (76 {t("reviews")})
            </p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                size="icon"
                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full"
              >
                <Send className="size-5" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-3xl font-bold">
                  {t("sendMessage")}
                </DialogTitle>
              </DialogHeader>
              <SendMessageForm />
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
}
