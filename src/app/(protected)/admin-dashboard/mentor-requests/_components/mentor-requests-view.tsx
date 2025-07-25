"use client";

import { MentorRequestCard } from "./mentor-request-card";
import { MentorRequestsTable } from "./mentor-requests-table";
import { LayoutGrid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useTranslations } from "next-intl";

interface MentorRequest {
  id: number;
  name: string;
  email: string;
  category: string;
  jobTitle: string;
  image: string;
}

interface MentorRequestsViewProps {
  requests: MentorRequest[];
}

export function MentorRequestsView({ requests }: MentorRequestsViewProps) {
  const t = useTranslations("MentorRequestsView");
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");

  if (requests.length === 0) {
    return null; // Let the parent handle empty state
  }

  return (
    <>
      {/* View Toggle */}
      <div className="mb-6 flex items-center justify-end">
        <div className="bg-muted flex items-center gap-2 rounded-lg p-1">
          <Button
            variant={viewMode === "cards" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("cards")}
            className="gap-2"
          >
            <LayoutGrid className="h-4 w-4" />
            {t("cards_view_button")}
          </Button>
          <Button
            variant={viewMode === "table" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("table")}
            className="gap-2"
          >
            <List className="h-4 w-4" />
            {t("table_view_button")}
          </Button>
        </div>
      </div>

      {/* Content */}
      {viewMode === "cards" ? (
        <div className="grid gap-6 lg:grid-cols-2">
          {requests.map((request) => (
            <MentorRequestCard key={request.id} request={request} />
          ))}
        </div>
      ) : (
        <MentorRequestsTable requests={requests} />
      )}
    </>
  );
}
