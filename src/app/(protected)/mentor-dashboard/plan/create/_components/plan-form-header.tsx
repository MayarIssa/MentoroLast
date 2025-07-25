"use client";

import { Steps } from "@/components/steps";
import { useFormControlsContext } from "./plan-form-controls-provider";
import type { Steps as TSteps } from "./plan-form";

interface FormHeaderProps {
  steps: TSteps;
}

export function FormHeader({ steps }: FormHeaderProps) {
  const { currentPageIndex } = useFormControlsContext();
  const currentStep = steps[currentPageIndex];

  return (
    <Steps
      count={currentPageIndex}
      title={currentStep?.title ?? ""}
      description={currentStep?.description ?? ""}
      stepsNum={steps.length - 1}
    />
  );
}
