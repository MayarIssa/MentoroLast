"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { User, Mail, Briefcase, Tag, ChevronRight, Eye } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

interface MentorRequest {
  id: number;
  name: string;
  email: string;
  category: string;
  jobTitle: string;
  image: string;
}

export function MentorRequestCard({ request }: { request: MentorRequest }) {
  const t = useTranslations("MentorRequestCard");

  return (
    <Link href={`/admin-dashboard/mentor-requests/${request.id}`}>
      <Card className="hover:shadow-primary/10 border-border/50 group cursor-pointer border transition-all duration-200 hover:shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-start gap-4">
            <Avatar className="border-muted h-16 w-16 border-2">
              <AvatarImage src={request.image} alt={request.name} />
              <AvatarFallback>
                <User className="text-muted-foreground h-8 w-8" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
              <div className="flex items-start justify-between">
                <CardTitle className="text-foreground group-hover:text-primary text-xl font-semibold transition-colors">
                  {request.name}
                </CardTitle>
                <ChevronRight className="text-muted-foreground group-hover:text-primary h-5 w-5 transition-all group-hover:translate-x-1" />
              </div>
              <CardDescription className="text-muted-foreground flex items-center gap-2">
                <Mail className="h-4 w-4" />
                {request.email}
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid gap-3">
            <div className="flex items-center gap-2">
              <Briefcase className="text-primary h-4 w-4" />
              <span className="text-sm font-medium">{t("job_title_label")}</span>
              <span className="text-muted-foreground text-sm">{request.jobTitle}</span>
            </div>

            <div className="flex items-center gap-2">
              <Tag className="text-primary h-4 w-4" />
              <span className="text-sm font-medium">{t("category_label")}</span>
              <Badge variant="secondary" className="text-xs">{request.category}</Badge>
            </div>
          </div>

          <div className="border-border/50 border-t pt-3">
            <div className="text-muted-foreground group-hover:text-primary flex items-center gap-2 text-sm transition-colors">
              <Eye className="h-4 w-4" />
              <span>{t("review_application")}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}