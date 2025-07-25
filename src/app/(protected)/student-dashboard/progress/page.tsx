"use client";

import { useState, useEffect, memo } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import type { StaticImageData } from "next/image";
import Link from "next/link";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";

// Import images
import MayarImage from "@/assets/images/mentors/Mayar.jpg";
import MariemTahaImage from "@/assets/images/mentors/Mariem Taha.jpg";
import IbrahimSaadImage from "@/assets/images/mentors/Ibrahim Saad.jpg";
import MohamedKhaledImage from "@/assets/images/mentors/Mido.jpg";
import IbrahimAbdelrahmanImage from "@/assets/images/mentors/Ibrahim Abdelrahman.jpg";
import GhenaImage from "@/assets/images/mentors/ghena.jpg";
import communityImage1 from "@/assets/images/community/net.png";
import communityImage2 from "@/assets/images/community/reg.png";
import communityImage3 from "@/assets/images/community/skill.png";
import communityImage4 from "@/assets/images/community/next.png";
import { useQuery } from "@tanstack/react-query";
import { API } from "@/lib/api";

type BadgeName = "Microsoft_NET" | "Plan Register" | "Skill Earned" | "NextJS";

interface Badge {
  id: number;
  name: BadgeName;
  icon: StaticImageData;
}

interface Student {
  readonly id: number;
  readonly name: string;
  readonly points: number;
  readonly position: number;
  readonly picture: StaticImageData;
}

interface ProgressData {
  points: number;
  totalPoints: number;
  stars: number;
  badges: Badge[];
}

// Static data (frozen to prevent mutations)
const staticProgressData: ProgressData = Object.freeze({
  points: 850,
  totalPoints: 1000,
  stars: 8,
  badges: [
    { id: 1, name: "Microsoft_NET" as BadgeName, icon: communityImage1 },
    { id: 2, name: "Plan Register" as BadgeName, icon: communityImage2 },
    { id: 3, name: "Skill Earned" as BadgeName, icon: communityImage3 },
    { id: 4, name: "NextJS" as BadgeName, icon: communityImage4 },
  ],
});

const staticLeaderboardData: readonly Student[] = Object.freeze([
  {
    id: 1,
    name: "Ibrahim Saad",
    points: 850,
    position: 1,
    picture: IbrahimSaadImage,
  },
  {
    id: 2,
    name: "Mayar Mohamed",
    points: 780,
    position: 2,
    picture: MayarImage,
  },
  {
    id: 3,
    name: "Mariem Taha",
    points: 500,
    position: 3,
    picture: MariemTahaImage,
  },
  {
    id: 4,
    name: "Mohamed Khaled",
    points: 200,
    position: 4,
    picture: MohamedKhaledImage,
  },
  {
    id: 5,
    name: "Ibrahim Abdelrahman",
    points: 175,
    position: 5,
    picture: IbrahimAbdelrahmanImage,
  },
  {
    id: 6,
    name: "Ghena Abdelatif",
    points: 115,
    position: 6,
    picture: GhenaImage,
  },
]);

// Memoized Badge component
const Badge = memo(({ badge }: { badge: Badge }) => {
  const t = useTranslations("Progress");
  return (
    <div className="group flex flex-col items-center">
      <div className="relative">
        <Image
          src={badge.icon}
          width={48}
          height={48}
          alt={t("badgeAlt", { name: badge.name })}
          className="mb-2 rounded-lg shadow-sm transition-shadow duration-300 group-hover:shadow-md dark:shadow-gray-700"
          placeholder="blur"
        />
        <div className="absolute inset-0 rounded-lg bg-black/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
      </div>
      <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
        {t(`badges.${badge.name}`)}
      </p>
    </div>
  );
});
Badge.displayName = "Badge";

// Memoized LeaderboardItem component
const LeaderboardItem = memo(({ student }: { student: Student }) => {
  const t = useTranslations("Progress");
  return (
    <div className="bg-background flex items-center justify-between rounded-xl border border-gray-100 p-3 shadow-sm transition-shadow duration-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:shadow-gray-700">
      <div className="flex items-center gap-4">
        <Image
          src={student.picture}
          width={60}
          height={60}
          alt={t("studentAlt", { name: student.name })}
          className="rounded-full border border-gray-200 dark:border-gray-700"
          placeholder="blur"
        />
        <div>
          <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
            {student.name}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {student.points} {t("points")}
          </p>
        </div>
      </div>
      <div className="rounded-full bg-green-400 px-3 py-1 text-sm font-semibold text-white">
        {student.position}
      </div>
    </div>
  );
});
LeaderboardItem.displayName = "LeaderboardItem";

export default function ProgressPage() {
  const t = useTranslations("Progress");
  const [progressData, setProgressData] = useState<ProgressData | null>(null);
  const [leaderboardData, setLeaderboardData] = useState<
    readonly Student[] | null
  >(null);
  const [isLoading, setIsLoading] = useState(true);
  const { data: progress } = useQuery({
    queryKey: ["progress"],
    queryFn: () => API.queries.progress.getProgress(14),
  });
  console.log(progress);

  useEffect(() => {
    // Simulate data fetch
    const loadData = () => {
      setTimeout(() => {
        setProgressData(staticProgressData);
        setLeaderboardData(staticLeaderboardData);
        setIsLoading(false);
      }, 100);
    };
    loadData();
  }, []);

  if (isLoading || !progressData || !leaderboardData) {
    return (
      <div className="flex h-screen items-center justify-start ps-8">
        <div className="animate-pulse text-lg font-medium text-gray-500 dark:text-gray-400">
          {t("loading")}
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen" dir="auto">
      {/* Main Content */}
      <div className="flex-1 overflow-auto p-8">
        {/* Navbar */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/student-dashboard">
              <Button
                variant="ghost"
                size="sm"
                aria-label={t("backButtonAria")}
                className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <ChevronLeft />
              </Button>
            </Link>
            <h1 className="max-w-screen-lg text-4xl font-extrabold text-gray-800 dark:text-gray-200">
              {t("title")}
            </h1>
          </div>
        </div>

        {/* Achievements Section */}
        <div className="bg-background mb-6 rounded-xl border border-gray-100 p-6 shadow-lg dark:border-gray-700 dark:bg-gray-800">
          {/* Progress Bar */}
          <div className="relative mb-4">
            <div className="flex h-8 items-center overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
              <div
                className="relative flex h-8 items-center justify-center rounded-full bg-green-400 transition-none"
                style={{
                  width: `${(progressData.points / progressData.totalPoints) * 100}%`,
                }}
              >
                <span className="text-sm font-bold text-white">
                  {progressData.points}/{progressData.totalPoints}
                </span>
                <div className="absolute end-0 translate-x-1/2">
                  <div className="relative">
                    <Star
                      className="h-8 w-8 text-yellow-500"
                      fill="currentColor"
                    />
                    <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
                      {progressData.stars}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Badges */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              {t("recentBadges")}
            </h3>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                disabled
                aria-label={t("prevBadgesAria")}
                className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                aria-label={t("nextBadgesAria")}
                className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {progressData.badges.map((badge) => (
              <Badge key={badge.id} badge={badge} />
            ))}
          </div>
        </div>

        {/* Leaderboard Section */}
        <div className="bg-background relative rounded-xl border border-gray-100 p-6 shadow-lg dark:border-gray-700 dark:bg-gray-800">
          <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-gray-200">
            {t("leaderboard")}
          </h3>
          {/* Decorative Stars */}
          {[
            { top: "0.5rem", start: "1rem", size: 6 },
            { top: "2rem", end: "1.5rem", size: 5 },
            { bottom: "1rem", start: "2rem", size: 4 },
            { bottom: "2.5rem", end: "2.5rem", size: 6 },
            { top: "3rem", start: "3rem", size: 5 },
          ].map((star, index) => (
            <div
              key={index}
              className="absolute opacity-50"
              style={{
                top: star.top,
                left: star.start,
                right: star.end,
                bottom: star.bottom,
              }}
            >
              <Star
                className={`text-orange-500 dark:text-orange-400 w-${star.size} h-${star.size}`}
              />
            </div>
          ))}

          {/* Podium and Remaining Students */}
          <div className="flex gap-6">
            {/* Podium for Top 3 */}
            <div className="flex flex-1 items-end justify-start">
              <div className="flex items-end gap-6">
                {/* 2nd Place */}
                <div className="group flex flex-col items-center">
                  <Image
                    src={leaderboardData[1]?.picture ?? communityImage1}
                    width={64}
                    height={64}
                    alt={t("studentAlt", {
                      name: leaderboardData[1]?.name ?? "2nd Place",
                    })}
                    className="mb-2 rounded-full border-2 border-gray-200 transition-colors duration-300 group-hover:border-green-400 dark:border-gray-700"
                    placeholder="blur"
                  />
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                    {leaderboardData[1]?.name ?? "N/A"}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {leaderboardData[1]?.points ?? 0} {t("points")}
                  </p>
                  <div className="flex h-16 w-20 items-center justify-center rounded-t-lg bg-gray-300 shadow-sm dark:bg-gray-600 dark:shadow-gray-700">
                    <span className="text-lg font-bold text-white">2</span>
                  </div>
                </div>

                {/* 1st Place */}
                <div className="group flex flex-col items-center">
                  <Image
                    src={leaderboardData[0]?.picture ?? communityImage1}
                    width={80}
                    height={80}
                    alt={t("studentAlt", {
                      name: leaderboardData[0]?.name ?? "1st Place",
                    })}
                    className="mb-2 rounded-full border-2 border-green-400 transition-colors duration-300 group-hover:border-green-500"
                    placeholder="blur"
                  />
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                    {leaderboardData[0]?.name ?? "N/A"}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {leaderboardData[0]?.points ?? 0} {t("points")}
                  </p>
                  <div className="flex h-24 w-20 items-center justify-center rounded-t-lg bg-green-400 shadow-sm dark:shadow-gray-700">
                    <span className="text-lg font-bold text-white">1</span>
                  </div>
                </div>

                {/* 3rd Place */}
                <div className="group flex flex-col items-center">
                  <Image
                    src={leaderboardData[2]?.picture ?? communityImage1}
                    width={64}
                    height={64}
                    alt={t("studentAlt", {
                      name: leaderboardData[2]?.name ?? "3rd Place",
                    })}
                    className="mb-2 rounded-full border-2 border-gray-200 transition-colors duration-300 group-hover:border-orange-400 dark:border-gray-700"
                    placeholder="blur"
                  />
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                    {leaderboardData[2]?.name ?? "N/A"}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {leaderboardData[2]?.points ?? 0} {t("points")}
                  </p>
                  <div className="flex h-12 w-20 items-center justify-center rounded-t-lg bg-orange-400 shadow-sm dark:shadow-gray-700">
                    <span className="text-lg font-bold text-white">3</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Remaining Students */}
            <div className="flex-1 space-y-2">
              {leaderboardData.slice(3).map((student) => (
                <LeaderboardItem key={student.id} student={student} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
