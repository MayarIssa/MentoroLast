"use client";

import {
  Clock,
  Users,
  AlertTriangle,
  TrendingUp,
  CheckCircle,
  Target,
  BookOpen,
  MoreHorizontal,
  Filter,
  Loader2,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  PieChart,
  Pie,
} from "recharts";
import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { API } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

const progressChartConfig = {
  progress: {
    label: "Progress",
    color: "#8884d8",
  },
} satisfies ChartConfig;

const struggleChartConfig = {
  expected: {
    label: "Expected Hours",
    color: "#82ca9d",
  },
  actual: {
    label: "Actual Hours",
    color: "#8884d8",
  },
  overdue: {
    label: "Overdue Hours",
    color: "#ff7300",
  },
} satisfies ChartConfig;

const stageChartConfig = {
  "HTML/CSS Basics": {
    label: "HTML/CSS Basics",
    color: "#8884d8",
  },
  "JavaScript ES6+": {
    label: "JavaScript ES6+",
    color: "#82ca9d",
  },
  "React Fundamentals": {
    label: "React Fundamentals",
    color: "#ffc658",
  },
  "React Hooks": {
    label: "React Hooks",
    color: "#ff7300",
  },
  "State Management": {
    label: "State Management",
    color: "#8dd1e1",
  },
} satisfies ChartConfig;

export default function MentorDashboardHome() {
  const t = useTranslations("MentorDashboard");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "struggling" | "on-track"
  >("all");

  // API Queries
  const {
    data: mentorCurrentStages,
    isLoading: isLoadingCurrentStages,
    error: currentStagesError,
  } = useQuery({
    queryKey: ["mentorCurrentStages"],
    queryFn: () => API.queries.reports.getMentorCurrentStages(),
  });

  const {
    data: struggleStudents,
    isLoading: isLoadingStruggleStudents,
    error: struggleStudentsError,
  } = useQuery({
    queryKey: ["struggleStudents"],
    queryFn: () => API.queries.reports.getStruggleStudentsForMentor(),
  });

  const {
    data: myStudents,
    isLoading: isLoadingMyStudents,
    error: myStudentsError,
  } = useQuery({
    queryKey: ["myStudents"],
    queryFn: () => API.queries.mentors.getStudentAssignedToMentor(),
  });

  // Combined loading state
  const isLoading =
    isLoadingCurrentStages || isLoadingStruggleStudents || isLoadingMyStudents;

  // Error handling
  const hasError =
    currentStagesError ?? struggleStudentsError ?? myStudentsError;

  // Merge student data from different APIs
  const combinedStudentData = useMemo(() => {
    if (!mentorCurrentStages || !myStudents) return [];

    return mentorCurrentStages.map((stageData) => {
      const studentInfo = myStudents.find(
        (student) => student.stundetId.toString() === stageData.studentId,
      );

      return {
        ...stageData,
        studentName:
          studentInfo?.studentName ?? `Student ${stageData.studentId}`,
        planTitle: studentInfo?.planTitle ?? t("unknownPlan"),
      };
    });
  }, [mentorCurrentStages, myStudents, t]);

  // Calculate summary metrics
  const totalStudents = combinedStudentData.length;
  const strugglingStudentsCount = struggleStudents?.length ?? 0;
  const averageProgress = useMemo(() => {
    if (!combinedStudentData.length) return 0;

    return (
      combinedStudentData.reduce((acc, student) => {
        const progress =
          (student.currentStageId / student.roadmapStages.length) * 100;
        return acc + progress;
      }, 0) / totalStudents
    );
  }, [combinedStudentData, totalStudents]);

  const totalOverdueHours = useMemo(() => {
    return (
      struggleStudents?.reduce(
        (acc, student) => acc + student.timeOverdue,
        0,
      ) ?? 0
    );
  }, [struggleStudents]);

  // Prepare chart data
  const progressData = useMemo(() => {
    return combinedStudentData.map((student) => ({
      name: student.studentName,
      progress: (student.currentStageId / student.roadmapStages.length) * 100,
      currentStage: student.currentStageTitle,
    }));
  }, [combinedStudentData]);

  const struggleData = useMemo(() => {
    return (
      struggleStudents?.map((student) => ({
        name: student.stageTitle,
        expected: student.expectedDuration,
        actual: student.timeSpent,
        overdue: student.timeOverdue,
      })) ?? []
    );
  }, [struggleStudents]);

  const stageDistribution = useMemo(() => {
    return combinedStudentData.reduce(
      (acc, student) => {
        const stageName = student.currentStageTitle;
        acc[stageName] = (acc[stageName] ?? 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );
  }, [combinedStudentData]);

  const pieData = useMemo(() => {
    return Object.entries(stageDistribution).map(([name, value]) => ({
      name,
      value,
      fill:
        stageChartConfig[name as keyof typeof stageChartConfig]?.color ??
        "#8884d8",
    }));
  }, [stageDistribution]);

  // Filter students for the table
  const filteredStudents = useMemo(() => {
    return combinedStudentData.filter((student) => {
      const matchesSearch = student.studentName
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const isStruggling = struggleStudents?.some(
        (s) => s.studentId === student.studentId,
      );

      if (statusFilter === "struggling" && !isStruggling) return false;
      if (statusFilter === "on-track" && isStruggling) return false;

      return matchesSearch;
    });
  }, [combinedStudentData, searchTerm, statusFilter, struggleStudents]);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <p className="text-lg">{t("loading")}</p>
        </div>
      </div>
    );
  }

  // Error state
  if (hasError) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="text-destructive mx-auto mb-4 h-12 w-12" />
          <h2 className="mb-2 text-xl font-semibold">{t("errorTitle")}</h2>
          <p className="text-muted-foreground">{t("errorMessage")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mx-auto max-w-4xl text-center text-pretty">
        <h1 className="text-4xl font-extrabold">{t("title")}</h1>
        <p className="text-muted-foreground mt-2 text-lg">{t("description")}</p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("totalStudents")}
            </CardTitle>
            <Users className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudents}</div>
            <p className="text-muted-foreground text-xs">
              {t("activeMentoring")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("strugglingStudents")}
            </CardTitle>
            <AlertTriangle className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{strugglingStudentsCount}</div>
            <p className="text-muted-foreground text-xs">
              {t("studentsBehind")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("averageProgress")}
            </CardTitle>
            <TrendingUp className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {averageProgress.toFixed(1)}%
            </div>
            <p className="text-muted-foreground text-xs">
              {t("acrossAllStudents")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("overdueHours")}
            </CardTitle>
            <Clock className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOverdueHours}h</div>
            <p className="text-muted-foreground text-xs">
              {t("totalTimeBehind")}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Student Progress Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              {t("studentProgressOverview")}
            </CardTitle>
            <CardDescription>{t("currentProgressPercentage")}</CardDescription>
          </CardHeader>
          <CardContent>
            {progressData.length > 0 ? (
              <ChartContainer config={progressChartConfig}>
                <BarChart data={progressData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Bar dataKey="progress" fill="var(--color-progress)" />
                </BarChart>
              </ChartContainer>
            ) : (
              <div className="text-muted-foreground flex h-64 items-center justify-center">
                {t("noProgressData")}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stage Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              {t("currentStageDistribution")}
            </CardTitle>
            <CardDescription>{t("whereStudentsAre")}</CardDescription>
          </CardHeader>
          <CardContent>
            {pieData.length > 0 ? (
              <ChartContainer config={stageChartConfig}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                  />
                  <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                </PieChart>
              </ChartContainer>
            ) : (
              <div className="text-muted-foreground flex h-64 items-center justify-center">
                {t("noStageData")}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Struggle Analysis Chart */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              {t("timeSpentVsExpected")}
            </CardTitle>
            <CardDescription>{t("analysisOfStudentsBehind")}</CardDescription>
          </CardHeader>
          <CardContent>
            {struggleData.length > 0 ? (
              <ChartContainer config={struggleChartConfig}>
                <BarChart data={struggleData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Bar dataKey="expected" fill="var(--color-expected)" />
                  <Bar dataKey="actual" fill="var(--color-actual)" />
                  <Bar dataKey="overdue" fill="var(--color-overdue)" />
                </BarChart>
              </ChartContainer>
            ) : (
              <div className="text-muted-foreground flex h-64 items-center justify-center">
                {t("noStruggleData")}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Scalable Student Details Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-6 w-6" />
                {t("studentProgressDetails")}
              </CardTitle>
              <CardDescription>{t("detailedView")}</CardDescription>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="flex flex-col gap-4 sm:flex-row">
            <Input
              placeholder={t("searchStudents")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  {statusFilter === "all"
                    ? t("allStudents")
                    : statusFilter === "struggling"
                      ? t("struggling")
                      : t("onTrack")}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setStatusFilter("all")}>
                  {t("allStudents")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("struggling")}>
                  {t("strugglingStudentsDropdown")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("on-track")}>
                  {t("onTrackStudentsDropdown")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("student")}</TableHead>
                <TableHead>{t("currentStage")}</TableHead>
                <TableHead>{t("progress")}</TableHead>
                <TableHead>{t("status")}</TableHead>
                <TableHead>{t("nextStage")}</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => {
                const isStruggling = struggleStudents?.some(
                  (s) => s.studentId === student.studentId,
                );
                const progressPercent =
                  (student.currentStageId / student.roadmapStages.length) * 100;
                const nextStage = student.roadmapStages.find(
                  (stage) => stage.order === student.currentStageId + 1,
                );

                return (
                  <TableRow key={student.studentId}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full">
                          {student.studentName.charAt(0)}
                        </div>
                        {student.studentName}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <BookOpen className="text-muted-foreground h-4 w-4" />
                        {student.currentStageTitle}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{progressPercent.toFixed(0)}%</span>
                          <span className="text-muted-foreground">
                            {student.currentStageId}/
                            {student.roadmapStages.length}
                          </span>
                        </div>
                        <Progress value={progressPercent} className="h-2" />
                      </div>
                    </TableCell>
                    <TableCell>
                      {isStruggling ? (
                        <Badge
                          variant="destructive"
                          className="flex w-fit items-center gap-1"
                        >
                          <AlertTriangle className="h-3 w-3" />
                          {t("behindSchedule")}
                        </Badge>
                      ) : (
                        <Badge
                          variant="secondary"
                          className="flex w-fit items-center gap-1"
                        >
                          <CheckCircle className="h-3 w-3" />
                          {t("onTrackBadge")}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {nextStage ? (
                        <span className="text-muted-foreground">
                          {nextStage.title}
                        </span>
                      ) : (
                        <Badge variant="outline" className="text-green-600">
                          {t("completed")}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            {t("viewDetails")}
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            {t("sendMessage")}
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            {t("scheduleMeeting")}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {filteredStudents.length === 0 && !isLoading && (
            <div className="text-muted-foreground py-8 text-center">
              {t("noStudentsFound")}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
