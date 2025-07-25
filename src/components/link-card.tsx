import Link from "next/link";
import { Card, CardContent, CardFooter } from "./ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocale } from "next-intl";

export function LinkCard({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  const isArabic = useLocale().startsWith("ar");

  return (
    <Link href={href}>
      <Card
        className={cn(
          "group ring-primary/20 transition-all hover:ring-2",
          className,
        )}
      >
        <CardContent>{children}</CardContent>
        <CardFooter className="justify-end">
          {isArabic ? (
            <ChevronLeft className="transition-transform duration-300 group-hover:-translate-x-1" />
          ) : (
            <ChevronRight className="transition-transform duration-300 group-hover:translate-x-1" />
          )}
        </CardFooter>
      </Card>
    </Link>
  );
}
