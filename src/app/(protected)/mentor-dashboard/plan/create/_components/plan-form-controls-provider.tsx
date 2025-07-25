"use client";

import { createContext, type PropsWithChildren, use, useState } from "react";
import type { Steps } from "./plan-form";

export interface FormControlsContextProps {
  currentPageIndex: number;
  historicPageIndex: number;
  delta: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  isFinalPage: boolean;
  handleNext: () => void;
  handleBack: () => void;
  setCurrentPageIndex: (index: number) => void;
  setHistoricPageIndex: (index: number) => void;
  setPage: (index: number) => void;
}

// Helper type for nested key paths
export type NestedKeyOf<ObjectType extends object> = {
  [Key in keyof ObjectType & string]: ObjectType[Key] extends object
    ? Key | `${Key}.${NestedKeyOf<ObjectType[Key]>}`
    : Key;
}[keyof ObjectType & string];

export type FormStep<T extends object> = {
  id: string;
  title: string;
  description: string;
  component: () => React.JSX.Element;
  inputs: NestedKeyOf<T>[];
};

const FormControlsContext = createContext<FormControlsContextProps | null>(
  null,
);

export function useFormControlsContext() {
  const ctx = use(FormControlsContext);

  if (!ctx) {
    throw new Error("Must be used within a FormControlsProvider");
  }
  return ctx;
}

interface FormControlsProviderProps extends PropsWithChildren {
  steps: Steps;
}

export const FormControlsProvider = ({
  children,
  steps,
}: FormControlsProviderProps) => {
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);
  const [historicPageIndex, setHistoricPageIndex] = useState<number>(0);

  const delta = currentPageIndex - historicPageIndex;

  const handleNext = () => {
    if (currentPageIndex === steps.length - 1) return;
    setCurrentPageIndex(currentPageIndex + 1);
    setHistoricPageIndex(currentPageIndex);
  };

  const handleBack = () => {
    if (currentPageIndex === 0) return;
    setCurrentPageIndex(currentPageIndex - 1);
    setHistoricPageIndex(currentPageIndex);
  };

  const setPage = (index: number) => {
    if (index === currentPageIndex) return;
    if (index > currentPageIndex + 1) return;
    setCurrentPageIndex(index);
    setHistoricPageIndex(currentPageIndex);
  };

  const hasNextPage = currentPageIndex < steps.length - 1;
  const hasPreviousPage = currentPageIndex > 0;
  const isFinalPage = currentPageIndex === steps.length - 1;

  return (
    <FormControlsContext.Provider
      value={{
        currentPageIndex,
        historicPageIndex,
        delta,
        hasNextPage,
        hasPreviousPage,
        handleNext,
        handleBack,
        setCurrentPageIndex,
        setHistoricPageIndex,
        setPage,
        isFinalPage,
      }}
    >
      {children}
    </FormControlsContext.Provider>
  );
};
