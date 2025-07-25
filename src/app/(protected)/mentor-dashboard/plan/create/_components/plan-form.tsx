"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { z } from "zod";
import {
  FormControlsProvider,
  type FormStep,
} from "./plan-form-controls-provider";
import { FormHeader } from "./plan-form-header";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RenderFields } from "./render-fields";
import { FormFooter } from "./plan-form-footer";
import { useEffect, useMemo, useState } from "react";
import { PlanTypeField } from "./plan-type-field";
import { PlanDescriptionField } from "./plan-description";
import { PlanDurationFields } from "./plan-duration-fields";
import { PlanPriceField } from "./plan-form-price";
import { PlanFormResources } from "./plan-form-resources";
import { API } from "@/lib/api";
import { tryCatch } from "@/lib/utils/try-catch";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

const BasePlanSchema = z.object({
  description: z.string().min(2, { message: "Description is required" }),
  duration: z.coerce
    .number()
    .min(1, { message: "Duration must be at least 1" })
    .max(12, { message: "Duration must not exceed 12" }),
  durationType: z.enum(["Days", "Weeks", "Months"]),
  price: z.coerce
    .number()
    .min(100, { message: "Price must be at least 100" })
    .max(1000, { message: "Price must not exceed 1000" }),
});

const CustomizedPlanSchema = BasePlanSchema.extend({
  type: z.literal("Customized"),
});
export type TCustomizedPlanSchema = z.infer<typeof CustomizedPlanSchema>;

const RoadmapPlanSchema = BasePlanSchema.extend({
  type: z.literal("Roadmap"),
  stages: z.array(
    z.object({
      title: z.string().min(1, { message: "Title is required" }),
      description: z.string().min(1, { message: "Description is required" }),
      order: z.number().min(1, { message: "Order must be at least 1" }),
      expectedDuration: z
        .string()
        .min(1, { message: "Expected duration must be at least 1" })
        .regex(/^\d{1,2}\.\d{2}:\d{2}:\d{2}$/, {
          message:
            "Expected duration must be in the format: DAYS.HOURS:MINUTES:SECONDS",
        }),
      resources: z
        .array(z.coerce.number())
        .min(1, { message: "At least one resource is required" }),
    }),
  ),
});

export type TRoadmapPlanSchema = z.infer<typeof RoadmapPlanSchema>;

const GuidancePlanSchema = BasePlanSchema.extend({
  type: z.literal("Guidance"),
});
export type TGuidancePlanSchema = z.infer<typeof GuidancePlanSchema>;

const PlanFormSchema = z.discriminatedUnion("type", [
  CustomizedPlanSchema,
  RoadmapPlanSchema,
  GuidancePlanSchema,
]);
export type TPlanFormSchema = z.infer<typeof PlanFormSchema>;

export type Steps = (
  | FormStep<TCustomizedPlanSchema>
  | FormStep<TRoadmapPlanSchema>
  | FormStep<TGuidancePlanSchema>
)[];

export function PlanForm({
  type: defaultType,
}: {
  type?: "Customized" | "Roadmap" | "Guidance";
}) {
  const t = useTranslations("Plans.PlanForm");
  const DEFAULT_PLAN_STEPS = useMemo(
    (): Steps => [
      {
        id: "1",
        title: t("steps.planType.title"),
        description: t("steps.planType.description"),
        component: PlanTypeField,
        inputs: ["type"],
      },
      {
        id: "2",
        title: t("steps.description.title"),
        description: t("steps.description.description"),
        component: PlanDescriptionField,
        inputs: ["description"],
      },
      {
        id: "3",
        title: t("steps.price.title"),
        description: t("steps.price.description"),
        component: PlanPriceField,
        inputs: ["price"],
      },
      {
        id: "4",
        title: t("steps.duration.title"),
        description: t("steps.duration.description"),
        component: PlanDurationFields,
        inputs: ["duration", "durationType"],
      },
    ],
    [t],
  );
  const [steps, setSteps] = useState<Steps>(DEFAULT_PLAN_STEPS);

  const form = useForm<TPlanFormSchema>({
    resolver: zodResolver(PlanFormSchema),
    defaultValues: {
      type: defaultType ?? "Customized",
      duration: 1,
      durationType: "Months",
      description: "",
      price: 100,
    },
  });
  const type = form.watch("type");

  useEffect(() => {
    if (type !== "Roadmap") {
      setSteps(DEFAULT_PLAN_STEPS);
      return;
    }

    const newSteps = [...DEFAULT_PLAN_STEPS];
    newSteps.push({
      id: "5",
      title: t("steps.resources.title"),
      description: t("steps.resources.description"),
      component: PlanFormResources,
      inputs: ["stages"],
    });

    setSteps(newSteps);
  }, [DEFAULT_PLAN_STEPS, type, t]);

  const router = useRouter();

  async function onSubmit(values: TPlanFormSchema) {
    let isError = false;

    switch (values.type) {
      case "Customized": {
        const { error: createCustomPlanError } = await tryCatch(
          API.mutations.plans.createCustomizedPlan(values),
        );
        if (createCustomPlanError) isError = true;
        break;
      }
      case "Roadmap": {
        console.log(values);
        const { error: createRoadmapPlanError } = await tryCatch(
          API.mutations.plans.createRoadmapPlan(values),
        );
        if (createRoadmapPlanError) isError = true;
        break;
      }
      case "Guidance": {
        const { error: createGuidancePlanError } = await tryCatch(
          API.mutations.plans.createGuidancePlan(values),
        );
        if (createGuidancePlanError) isError = true;
        break;
      }
    }

    if (isError) {
      toast.error(t("errorToast"));
      return;
    }

    toast.success(t("successToast"));
    router.push("/mentor-dashboard/plan");
  }

  return (
    <Form {...form}>
      <FormControlsProvider steps={steps}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormHeader steps={steps} />

          <ScrollArea className="h-[calc(100vh-30rem)] overflow-hidden">
            <div className="space-y-4 pt-1 pr-4 pl-1">
              <RenderFields steps={steps} />
            </div>
          </ScrollArea>

          <FormFooter steps={steps} />
        </form>
      </FormControlsProvider>
    </Form>
  );
}
