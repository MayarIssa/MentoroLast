import Link from "next/link";
import MaxWidthWrapper from "./max-width-wrapper";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/button";
import { Clock, Instagram, Facebook, Mail, PhoneCall } from "lucide-react";
import { useTranslations } from "next-intl";

const Footer = () => {
  const t = useTranslations("Footer");

  return (
    <footer className="relative pt-32">
      <div className="absolute inset-0 -z-10">
        <svg
          viewBox="0 0 1440 450"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="fill-primary"
        >
          <path d="M-252 59.7273C503.693 -16.4694 924.606 -23.2761 1668 59.7273L1668 447.377H-252V59.7273Z" />
        </svg>
      </div>
      <MaxWidthWrapper className="bg-primary flex flex-col items-center justify-between gap-8 lg:flex-row lg:items-start">
        <div className="flex gap-8">
          <div className="space-y-4">
            <h4 className="text-primary-foreground text-2xl font-bold">
              {t("categories")}
            </h4>
            <nav className="flex flex-col gap-2">
              <Link
                className={cn(
                  buttonVariants({ variant: "link" }),
                  "text-primary-foreground/90 text-lg hover:underline",
                )}
                href="/mentors"
              >
                {t("mentors")}
              </Link>
              <Link
                className={cn(
                  buttonVariants({ variant: "link" }),
                  "text-primary-foreground/90 text-lg hover:underline",
                )}
                href="#about"
              >
                {t("aboutUs")}
              </Link>
            </nav>
          </div>
          <div className="space-y-4">
            <h4 className="text-primary-foreground text-2xl font-bold">
              {t("help")}
            </h4>
            <nav className="flex flex-col gap-2">
              <Link
                className={cn(
                  buttonVariants({ variant: "link" }),
                  "text-primary-foreground/90 text-lg hover:underline",
                )}
                href="/chatbot"
              >
                {t("chatbot")}
              </Link>
            </nav>
          </div>
        </div>
        <div className="space-y-4">
          <p className="text-primary-foreground flex items-center gap-2 text-lg">
            <PhoneCall className="inline" />
            {t("tel")}: +0201062100482
          </p>
          <p className="text-primary-foreground flex items-center gap-2 text-lg">
            <Clock className="inline" />
            {t("responseHours")}
          </p>
          <p className="text-primary-foreground flex items-center gap-2 text-lg">
            <Mail className="inline" />
            <a
              href="https://mail.google.com/mail/?view=cm&to=mentoro2025@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t("email")}: mentoro2025@gmail.com
            </a>
          </p>
          <div className="text-primary-foreground flex justify-evenly gap-4">
            <Link
              href="https://www.instagram.com/mentoro_edu?igsh=c3hnN3Y5NDl0eWcw"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Instagram className="h-6 w-6" />
            </Link>
            <Link
              href="https://www.facebook.com/profile.php?id=61577244029694&mibextid=wwXIfr"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Facebook className="h-6 w-6" />
            </Link>
            <Link
              href="https://www.tiktok.com/@mentoro_edu?_t=ZS-8xCnwV47pbN&_r=1"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg
                className="h-6 w-6"
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.893 0 2.896 2.896 0 0 1 2.821-2.933c.262 0 .52.028.77.084v-3.556a6.336 6.336 0 0 0-5.831 6.4 6.336 6.336 0 0 0 12.668 0V8.43a8.297 8.297 0 0 0 4.765 1.497v-3.474a4.793 4.793 0 0 1-1.285-2.767z" />
              </svg>
            </Link>
          </div>
        </div>
      </MaxWidthWrapper>
      <div className="bg-primary h-16 w-full"></div>
    </footer>
  );
};

export default Footer;
