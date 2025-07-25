"use client";

import type { PropsWithChildren } from "react";

import { DashboardHeader } from "@/components/dashboard-header";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Home, User, Receipt, AlertCircle } from "lucide-react";
import { BackButton } from "../../_components/back-button";
import { useTranslations } from "next-intl";

export function AdminLayoutContent({ children }: PropsWithChildren) {
  const t = useTranslations("AdminLayout");

  // Menu items.
  const items = [
    {
      title: t("dashboard"),
      url: "/admin-dashboard",
      icon: <Home size={20} />,
    },
    {
      title: t("mentor_requests"),
      url: "/admin-dashboard/mentor-requests",
      icon: <User size={20} />,
    },
    {
      title: t("payment_requests"),
      url: "/admin-dashboard/payment-requests",
      icon: <Receipt size={20} />,
    },
    {
      title: t("complaints"),
      url: "/admin-dashboard/complaints",
      icon: <AlertCircle size={20} />,
    },
  ];

  return (
    <div className="[--header-height:calc(theme(spacing.16))]">
      <SidebarProvider className="flex flex-col">
        <DashboardHeader />
        <div className="flex flex-1">
          <DashboardSidebar menuItems={items} />
          <SidebarInset className="p-4">
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
