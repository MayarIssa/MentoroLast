import { ProfileDropdown } from "@/components/profile-dropdown";
import { CustomSidebarTrigger } from "./custom-sidebar-trigger";
import robot from "@/assets/robot.png";
import Image from "next/image";
import Link from "next/link";
import { LocaleSwitcher } from "./locale-switcher";
import { ThemeModeToggle } from "./theme-mode-toggle";

export function DashboardHeader() {
  return (
    <header className="bg-background/90 sticky top-0 z-50 flex w-full items-center border-b backdrop-blur-sm">
      <div className="flex h-(--header-height) w-full items-center justify-between gap-2 px-4 md:px-8">
        <Link href="/" className="flex items-center gap-2">
          <Image src={robot} alt="Mentoro" className="w-10" />
          <h3 className="text-lg font-bold select-none">Mentoro</h3>
        </Link>
        <div className="hidden items-center gap-2 md:flex">
          <ThemeModeToggle />
          <LocaleSwitcher />
          <ProfileDropdown />
        </div>

        <CustomSidebarTrigger className="md:hidden" />
      </div>
    </header>
  );
}
