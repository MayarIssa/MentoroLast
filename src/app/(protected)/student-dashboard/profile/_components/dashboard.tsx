"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { useState } from "react";
import { useTranslations } from "next-intl";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

const monthlyData: Record<(typeof MONTHS)[number], number[]> = {
  January: [32, 45, 60, 25, 50, 70, 30],
  February: [28, 40, 55, 20, 45, 65, 25],
  March: [35, 50, 65, 30, 55, 75, 35],
  April: [30, 42, 58, 22, 48, 68, 28],
  May: [33, 47, 62, 27, 52, 72, 32],
  June: [31, 44, 59, 24, 49, 69, 29],
  July: [34, 48, 63, 28, 53, 73, 33],
  August: [36, 51, 66, 31, 56, 76, 36],
  September: [29, 41, 57, 21, 46, 67, 26],
  October: [37, 52, 67, 32, 57, 77, 37],
  November: [30, 43, 58, 23, 47, 68, 27],
  December: [38, 53, 68, 33, 58, 78, 38],
};

export function Dashboard() {
  const t = useTranslations("Profile.Dashboard");
  const tDays = useTranslations("Profile.BookACall.days");
  const [selectedMonth, setSelectedMonth] = useState<(typeof MONTHS)[number]>(
    MONTHS[0],
  );

  const calculateHours = (percent: number): string => {
    const hours = (percent / 100) * 24;
    return hours.toFixed(1);
  };

  const getMonthData = (month: (typeof MONTHS)[number]): number[] => {
    return monthlyData[month] ?? Array(7).fill(0);
  };

  return (
    <Card className="border-border rounded-xl shadow-lg transition-all duration-300">
      <CardHeader className="p-4">
        <CardTitle>
          <div className="flex items-center justify-between">
            <h3 className="text-foreground text-xl font-bold tracking-tight">
              {t("title", { month: selectedMonth })}
            </h3>
            <select
              className="border-input bg-gray-background text-gray-foreground focus:ring-ring focus:border-primary rounded-md border p-1.5 text-sm focus:ring-2"
              value={selectedMonth}
              onChange={(e) =>
                setSelectedMonth(e.target.value as (typeof MONTHS)[number])
              }
              aria-label="Select month"
            >
              {MONTHS.map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="grid grid-cols-7 gap-2">
          {DAYS.map((day, idx) => {
            const percentage = getMonthData(selectedMonth)[idx] ?? 0;
            const hours = calculateHours(percentage);
            return (
              <div
                key={day}
                className="flex h-56 flex-col items-center gap-3 rounded-lg p-2"
              >
                <Calendar className="text-primary/80 size-5" />
                <span className="text-muted-foreground text-xs font-medium">
                  {t("stats", { percentage, hours })}
                </span>
                <div className="flex flex-1 items-end">
                  <div className="bg-gray-background h-28 w-4 rotate-180 rounded-full">
                    <div
                      className="bg-primary w-full rounded-full transition-all duration-300"
                      style={{ height: `${percentage}%` }}
                    />
                  </div>
                </div>
                <span className="text-foreground text-sm font-semibold">
                  {tDays(day)}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
