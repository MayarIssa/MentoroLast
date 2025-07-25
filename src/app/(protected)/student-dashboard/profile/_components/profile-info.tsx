import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User as UserIcon, Star } from "lucide-react";
import { useTranslations } from "next-intl";
import type { User } from "@/lib/types";
import { API_URL } from "@/lib/constants";

export function ProfileInfo({ user }: { user: User }) {
  const t = useTranslations("Profile.ProfileInfo");

  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-8 p-6 md:flex-row">
        <div className="relative">
          <Avatar className="ring-primary/20 size-40 ring-4">
            <AvatarFallback className="bg-primary/10">
              <UserIcon className="size-full p-8" />
            </AvatarFallback>
            <AvatarImage
              src={`${API_URL}${user.image}`}
              className="w-full object-cover"
            />
          </Avatar>
        </div>
        <div className="text-center md:text-left">
          <h2 className="text-2xl font-semibold">{user.name}</h2>
          <div className="text-muted-foreground flex items-center gap-4">
            <div className="flex items-center gap-1">
              <UserIcon size={16} />
              <p>{user.role}</p>
            </div>
            <div className="flex items-center gap-1">
              <Star className="text-primary fill-primary" size={16} />
              <p>5.0 (76 {t("reviews")})</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
