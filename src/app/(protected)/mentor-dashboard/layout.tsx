import type { PropsWithChildren } from "react";

import { DashboardHeader } from "@/components/dashboard-header";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import {
  Clover,
  Library,
  ListTodo,
  MessageSquare,
  School,
  User,
  UserRoundCheck,
  Home,
  UserRoundX,
} from "lucide-react";
import { notFound } from "next/navigation";
import { getCurrentUser } from "@/server/actions/auth";
import { BackButton } from "../_components/back-button";
import { getTranslations } from "next-intl/server";

export default async function MentorDashboardLayout({
  children,
}: PropsWithChildren) {
  const user = await getCurrentUser();
  if (!user || user.role.toLowerCase() !== "mentor") {
    return notFound();
  }
  const t = await getTranslations();

  // Menu items.
  const items = [
    {
      title: t("common.dashboard"),
      url: "/mentor-dashboard",
      icon: <Home size={20} />,
    },
    {
      title: t("common.profile"),
      url: "/mentor-dashboard/profile",
      icon: <User size={20} />,
    },
    {
      title: t("common.resources"),
      url: "/mentor-dashboard/resources",
      icon: <Library size={20} />,
    },
    {
      title: t("common.chat"),
      url: "/mentor-dashboard/chat",
      icon: <MessageSquare size={20} />,
    },
    {
      title: t("mentorDashboard.tasks"),
      url: "/mentor-dashboard/tasks",
      icon: <ListTodo size={20} />,
    },
    {
      title: t("mentorDashboard.studentRequests"),
      url: "/mentor-dashboard/student-requests",
      icon: <UserRoundCheck size={20} />,
    },
    {
      title: t("mentorDashboard.allStudents"),
      url: "/mentor-dashboard/all-students",
      icon: <School size={20} />,
    },
    {
      title: t("mentorDashboard.plan"),
      url: "/mentor-dashboard/plan",
      icon: <Clover size={20} />,
    },
    {
      title: t("mentorDashboard.complaints"),
      url: "/mentor-dashboard/complaints",
      icon: <UserRoundX size={20} />,
    },
  ];

  return (
    <div className="[--header-height:calc(theme(spacing.16))]">
      <SidebarProvider className="flex flex-col">
        <DashboardHeader />
        <div className="flex flex-1">
          <DashboardSidebar menuItems={items} />
          <SidebarInset className="p-6">
            <div className="mb-4">
              <BackButton />
            </div>
            {children}
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
}
