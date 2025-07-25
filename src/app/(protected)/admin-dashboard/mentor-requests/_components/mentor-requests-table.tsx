"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { User, Eye, ChevronRight } from "lucide-react";
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

interface MentorRequestsTableProps {
  requests: MentorRequest[];
}

function RequestRow({ request }: { request: MentorRequest }) {
  const t = useTranslations("MentorRequestsTable");

  return (
    <TableRow className="hover:bg-muted/50 group cursor-pointer">
      <TableCell>
        <Link
          href={`/admin-dashboard/mentor-requests/${request.id}`}
          className="flex items-center gap-3 py-2"
        >
          <Avatar className="h-10 w-10">
            <AvatarImage src={request.image} alt={request.name} />
            <AvatarFallback>
              <User className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="group-hover:text-primary font-medium transition-colors">{request.name}</div>
            <div className="text-muted-foreground text-sm">{request.email}</div>
          </div>
        </Link>
      </TableCell>
      <TableCell>
        <Link href={`/admin-dashboard/mentor-requests/${request.id}`}>{request.jobTitle}</Link>
      </TableCell>
      <TableCell>
        <Link href={`/admin-dashboard/mentor-requests/${request.id}`}>
          <Badge variant="secondary">{request.category}</Badge>
        </Link>
      </TableCell>
      <TableCell>
        <Link href={`/admin-dashboard/mentor-requests/${request.id}`}>
          <Button
            variant="outline"
            size="sm"
            className="group-hover:border-primary group-hover:text-primary gap-2 transition-colors"
          >
            <Eye className="h-4 w-4" />
            {t("review_button")}
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
      </TableCell>
    </TableRow>
  );
}

export function MentorRequestsTable({ requests }: MentorRequestsTableProps) {
  const t = useTranslations("MentorRequestsTable");

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("table_header_applicant")}</TableHead>
            <TableHead>{t("table_header_job_title")}</TableHead>
            <TableHead>{t("table_header_category")}</TableHead>
            <TableHead className="text-right">{t("table_header_action")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.map((request) => (
            <RequestRow key={request.id} request={request} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}