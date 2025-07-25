import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UploadIcon, UserRoundX } from "lucide-react";
import { ComplaintForm } from "./_components/complaint-form";
import { API } from "@/lib/api";
import { tryCatch } from "@/lib/utils/try-catch";
import { ComplaintList } from "./_components/complaint-list";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getTranslations } from "next-intl/server";

export default async function ComplaintsPage() {
  const t = await getTranslations("StudentComplaints");
  const { data: complaints, error: complaintsError } = await tryCatch(
    API.queries.complaints.getComplaints(),
  );

  return (
    <section className="space-y-4">
      {/* Header */}
      <div>
        <h3 className="text-3xl font-bold">{t("title")}</h3>
        <p className="text-muted-foreground text-sm">{t("description")}</p>
      </div>

      <Tabs defaultValue="your-complaints">
        <TabsList>
          <TabsTrigger value="your-complaints">
            <UserRoundX />
            {t("yourComplaintsTab")} ({complaints?.length ?? 0})
          </TabsTrigger>
          <TabsTrigger value="submit-complaint">
            <UploadIcon />
            {t("submitComplaintTab")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="your-complaints">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserRoundX className="stroke-primary size-4" />
                {t("yourComplaintsTitle")}
              </CardTitle>
              <CardDescription>
                {t("yourComplaintsDescription")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[calc(100svh-25rem)]">
                {complaintsError ? (
                  <ComplaintsError t={t} />
                ) : complaints && complaints.length > 0 ? (
                  <ComplaintList complaints={complaints} />
                ) : (
                  <EmptyComplaints t={t} />
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="submit-complaint">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UploadIcon className="stroke-primary size-4" />
                {t("submitComplaintTitle")}
              </CardTitle>
              <CardDescription>
                {t("submitComplaintDescription")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ComplaintForm />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </section>
  );
}

type TranslationFunction = Awaited<
  ReturnType<typeof getTranslations<"StudentComplaints">>
>;

function ComplaintsError({ t }: { t: TranslationFunction }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-10">
      <UserRoundX className="text-muted-foreground h-10 w-10" />
      <h3 className="text-destructive text-lg font-medium">
        {t("errorTitle")}
      </h3>
      <p className="text-destructive text-sm">{t("errorDescription")}</p>
    </div>
  );
}

function EmptyComplaints({ t }: { t: TranslationFunction }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-10">
      <UserRoundX className="text-muted-foreground h-10 w-10" />
      <h3 className="text-lg font-medium">{t("emptyTitle")}</h3>
      <p className="text-muted-foreground text-sm">{t("emptyDescription")}</p>
    </div>
  );
}
