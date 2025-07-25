"use client";

import useAuth from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { UserCircle } from "lucide-react";
import { Inter } from "next/font/google";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import MaxWidthWrapper from "./max-width-wrapper";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { LocaleSwitcher } from "./locale-switcher";
import { ThemeModeToggle } from "./theme-mode-toggle";

const inter = Inter({ subsets: ["latin"], weight: ["600"] });

const Navbar = () => {
  const curPath = usePathname();
  const { user: session, logout } = useAuth();
  const t = useTranslations("Navbar");

  const NAV_LINKS = useMemo(
    () => [
      {
        href: "/",
        label: t("items.home"),
      },
      {
        href: "/mentors",
        label: t("items.mentors"),
      },
    
    ],
    [t],
  );

  return (
    <header>
      <MaxWidthWrapper className="grid grid-cols-2 gap-4 py-8 sm:grid-cols-5 sm:place-items-center md:px-16">
        {/* Logo */}
        <h1
          className={`${inter.className} text-2xl font-bold md:justify-self-start md:text-3xl`}
        >
          <Link href="/">{t("logo")}</Link>
        </h1>

        {/* Navbar */}
        <nav className="bg-background col-span-3 hidden items-center gap-2 justify-self-center rounded-2xl p-px font-semibold ring-2 ring-gray-300 sm:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-foreground hover:bg-primary/20 -m-px rounded-2xl px-4 py-1 text-sm transition md:text-lg",
                curPath === link.href &&
                  "bg-primary rounded-2xl text-black hover:opacity-85",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Auth Buttons */}
        <div className="flex items-center gap-2 place-self-end">
          <LocaleSwitcher />
          <ThemeModeToggle />

          {!session ? (
            <Link href="/auth">
              <UserCircle className="text-brand-200 hover:stroke-primary size-8 transition-colors md:place-self-end" />
            </Link>
          ) : (
            <Button onClick={logout}>{t("actions.logout")}</Button>
          )}
        </div>
      </MaxWidthWrapper>
    </header>
  );
};

export default Navbar;
