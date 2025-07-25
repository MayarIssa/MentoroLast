import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ComplaintActions } from "./complaint-actions";
import { useTranslations } from "next-intl";

interface ActiveComplaint {
  id: number;
  userName: string;
  userId: string;
  status: string;
  content: string;
  createdAt: string;
}

interface ArchivedComplaint {
  id: number;
  userId: string;
  status: string;
  content: string;
  createdAt: string;
  notes: string;
  resonOfRejection: string;
}

type Complaint = ActiveComplaint | ArchivedComplaint;

interface ComplaintsTableProps {
  title: string;
  description: string;
  complaints: Complaint[] | undefined;
  onAccept: (id: number) => Promise<void>;
  onReject: (id: number, notes: string) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  showActions?: boolean;
}

function isActiveComplaint(complaint: Complaint): complaint is ActiveComplaint {
  return "userName" in complaint;
}

export function ComplaintsTable({
  title,
  description,
  complaints,
  onAccept,
  onReject,
  onDelete,
  showActions = true,
}: ComplaintsTableProps) {
  const t = useTranslations("AdminComplaints");

  if (!complaints || complaints.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("table.no_complaints_title")}</CardTitle>
          <CardDescription>
            {t("table.no_complaints_description")}
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {title} ({complaints.length})
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("table.header_id")}</TableHead>
                <TableHead>{t("table.header_user")}</TableHead>
                <TableHead>{t("table.header_status")}</TableHead>
                <TableHead>{t("table.header_content")}</TableHead>
                <TableHead>{t("table.header_date")}</TableHead>
                {showActions && (
                  <TableHead className="text-right">
                    {t("table.header_actions")}
                  </TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {complaints.map((complaint) => (
                <TableRow key={complaint.id}>
                  <TableCell className="font-medium">#{complaint.id}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {isActiveComplaint(complaint)
                          ? complaint.userName
                          : t("table.user_not_available")}
                      </div>
                      <div className="text-muted-foreground text-sm">
                        {complaint.userId}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                        complaint.status === "Pending"
                          ? "bg-amber-50 text-amber-700 ring-amber-700/10"
                          : complaint.status === "Resolved"
                            ? "bg-green-50 text-green-700 ring-green-700/10"
                            : complaint.status === "Rejected"
                              ? "bg-red-50 text-red-700 ring-red-700/10"
                              : "bg-blue-50 text-blue-700 ring-blue-700/10"
                      }`}
                    >
                      {complaint.status === "Pending"
                        ? t("status.pending")
                        : complaint.status === "Resolved"
                          ? t("status.resolved")
                          : complaint.status === "Rejected"
                            ? t("status.rejected")
                            : complaint.status === "In Progress"
                              ? t("status.in_progress")
                              : complaint.status}
                    </span>
                  </TableCell>
                  <TableCell className="max-w-md">
                    <p className="truncate" title={complaint.content}>
                      {complaint.content}
                    </p>
                  </TableCell>
                  <TableCell>
                    {format(new Date(complaint.createdAt), "MMM dd, yyyy")}
                  </TableCell>
                  {showActions && (
                    <TableCell className="text-right">
                      <ComplaintActions
                        complaintId={complaint.id}
                        onAccept={onAccept}
                        onReject={onReject}
                        onDelete={onDelete}
                      />
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
