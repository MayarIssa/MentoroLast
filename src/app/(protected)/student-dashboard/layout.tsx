import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { DashboardHeader } from "@/components/dashboard-header";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { notFound } from "next/navigation";
import { getCurrentUser } from "@/server/actions/auth";
import type { PropsWithChildren } from "react";
import { BackButton } from "../_components/back-button";
import { getTranslations } from "next-intl/server";
import {
  BarChart,
  BookOpen,
  ListTodo,
  MessageSquare,
  User,
  Home,
  UserRoundX,
  CreditCard,
} from "lucide-react";

export default async function UserDashboardLayout({
  children,
}: PropsWithChildren) {
  const user = await getCurrentUser();
  if (!user || user.role.toLowerCase() !== "student") {
    return notFound();
  }
  const t = await getTranslations();

  // Menu items.
  const items = [
    {
      title: t("common.dashboard"),
      url: "/student-dashboard",
      icon: <Home size={20} />,
    },
    {
      title: t("common.profile"),
      url: "/student-dashboard/profile",
      icon: <User size={20} />,
    },
    {
      title: t("studentDashboard.yourMentors"),
      url: "/student-dashboard/my-mentors",
      icon: <User size={20} />,
    },
    {
      title: t("common.chat"),
      url: "/student-dashboard/chat",
      icon: <MessageSquare size={20} />,
    },
    {
      title: t("studentDashboard.progress"),
      url: "/student-dashboard/progress",
      icon: <BarChart size={20} />,
    },
    {
      title: t("studentDashboard.studentTask"),
      url: "/student-dashboard/student-task",
      icon: <ListTodo size={20} />,
    },
    {
      title: t("common.resources"),
      url: "/student-dashboard/resources",
      icon: <BookOpen size={20} />,
    },
    {
      title: t("studentDashboard.paymentRequests"),
      url: "/student-dashboard/payment-requests",
      icon: <CreditCard size={20} />,
    },
    {
      title: t("studentDashboard.complaints"),
      url: "/student-dashboard/complaints",
      icon: <UserRoundX size={20} />,
    },
    {
      title: t("studentDashboard.roadmaps"),
      url: "/student-dashboard/roadmaps",
      icon: <BookOpen size={20} />,
    },
  ];

  return (
    <div className="[--header-height:calc(theme(spacing.16))]">
      <SidebarProvider className="flex flex-col">
        <DashboardHeader />
        <div className="flex flex-1">
          <DashboardSidebar menuItems={items} />
          <SidebarInset className="overflow-x-hidden px-8 py-6">
            <div className="py-2">
              <BackButton />
            </div>
            {children}
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
}
