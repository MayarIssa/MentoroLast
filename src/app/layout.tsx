import QueryProvider from "@/components/query-provider";
import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";
import { Lato, Noto_Sans_Arabic } from "next/font/google";
import { NextIntlClientProvider, useLocale, useMessages } from "next-intl";
import { getLangDir } from "rtl-detect";
import "@/styles/globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import ChatbotLauncher from "@/components/ChatBotLuancher"; // Ensure correct import path
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Layout");
  return {
    title: t("title"),
    description: t("description"),
  };
}

const lato = Lato({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-sans",
});

const noto_sans_arabic = Noto_Sans_Arabic({
  variable: "--font-noto-sans-arabic",
  subsets: ["arabic"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = useLocale();
  const isArabic = locale === "ar";
  const dir = getLangDir(locale);
  const messages = useMessages();

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <body
        className={`${lato.className} ${
          isArabic
            ? `${noto_sans_arabic.className} leading-4`
            : "flex min-h-[calc(100vh-1px)] flex-col antialiased"
        }`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NextIntlClientProvider messages={messages}>
            <QueryProvider>
              {children}
              <ChatbotLauncher /> {/* Add ChatbotLauncher here */}
            </QueryProvider>
          </NextIntlClientProvider>
        </ThemeProvider>
        <Toaster richColors />
      </body>
    </html>
  );
}
