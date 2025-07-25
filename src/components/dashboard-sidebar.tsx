"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { NavUser } from "@/components/nav-user";
import { Menu } from "lucide-react";

type MenuItem = {
  title: string;
  url: string;
  icon: React.ReactNode;
};

export function DashboardSidebar({
  menuItems,
  ...props
}: React.ComponentProps<typeof Sidebar> & { menuItems: MenuItem[] }) {
  const pathname = usePathname();
  const isArabic = useLocale() === "ar";
  const { toggleSidebar } = useSidebar();
  const t = useTranslations("common");

  return (
    <Sidebar
      className={cn(
        "top-[var(--header-height)] !h-[calc(100svh-var(--header-height))]",
        isArabic ? "right-0 border-l" : "left-0 border-r",
        isArabic && "text-right",
      )}
      collapsible="icon"
      {...props}
    >
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-3">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    className={cn(
                      "h-9 gap-3 px-4 text-lg transition-colors",
                      pathname === item.url &&
                        "bg-primary text-white dark:text-black",
                    )}
                    asChild
                  >
                    <Link href={item.url}>
                      <span>{item.icon}</span>
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={toggleSidebar}>
              <Menu />
              {t("toggleSidebar")}
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem className="md:hidden">
            <NavUser />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
