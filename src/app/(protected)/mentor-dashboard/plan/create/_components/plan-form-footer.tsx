"use client";

import { useFormContext } from "react-hook-form";
import { Spinner } from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { useFormControlsContext } from "./plan-form-controls-provider";
import type { Steps } from "./plan-form";
import { useTranslations } from "next-intl";

interface FormFooterProps {
  steps: Steps;
}

export function FormFooter({ steps }: FormFooterProps) {
  const {
    handleBack,
    handleNext,
    hasNextPage,
    hasPreviousPage,
    isFinalPage,
    currentPageIndex,
  } = useFormControlsContext();
  const { trigger, clearErrors, formState } = useFormContext();
  const { isSubmitting } = formState;
  const t = useTranslations("Plans.FormFooter");

  const handleNextStep = async () => {
    const currentStep = steps[currentPageIndex];
    if (!currentStep) return;

    const isValid = await trigger(currentStep.inputs);
    if (isValid) {
      handleNext();
      clearErrors();
    }
  };

  return (
    <div className="flex gap-4">
      <Button
        type="button"
        variant="outline"
        className="flex-1"
        onClick={handleBack}
        disabled={!hasPreviousPage || isSubmitting}
      >
        {t("backButton")}
      </Button>

      {isFinalPage ? (
        <Button
          key="request-submit"
          className="flex-1"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Spinner size="sm" /> {t("submitButton")}
            </>
          ) : (
            t("submitButton")
          )}
        </Button>
      ) : (
        <Button
          key="request-next"
          type="button"
          onClick={handleNextStep}
          disabled={!hasNextPage || isSubmitting}
          className="flex-1"
        >
          {t("nextButton")}
        </Button>
      )}
    </div>
  );
}