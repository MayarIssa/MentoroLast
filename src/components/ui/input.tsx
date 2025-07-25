import * as React from "react";
import { cn } from "@/lib/utils";
import { useLocale } from "next-intl";

const Input = ({
  className,
  type,
  id,
  placeholder,
  value,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) => {
  const isArabic = useLocale().startsWith("ar");

  return (
    <div className="relative w-full">
      <input
        type={type}
        dir={isArabic ? "rtl" : "ltr"}
        className={cn(
          "peer border-primary file:text-foreground placeholder:text-muted-foreground focus:border-b-primary flex h-11 w-full border-b bg-transparent py-1 text-base transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus:border-b-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className,
        )}
        value={value}
        id={id}
        {...props}
      />

      <label
        htmlFor={id}
        className={cn(
          "text-muted-foreground pointer-events-none absolute top-4 left-0 cursor-text text-sm transition-all peer-focus:-top-2",
          value && "-top-2",
          isArabic && "right-0 left-auto",
        )}
      >
        {placeholder}
      </label>
    </div>
  );
};

Input.displayName = "Input";

export { Input };
