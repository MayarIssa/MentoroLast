import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const spinnerVariants = cva(
  "border-primary border-t-white rounded-full animate-spin",
  {
    variants: {
      size: {
        sm: "size-4 border-2",
        md: "size-6 border-3",
        lg: "size-8 border-4",
        page: "size-16 border-8",
      },
    },
    defaultVariants: {
      size: "sm",
    },
  },
);

interface SpinnerProps extends VariantProps<typeof spinnerVariants> {
  className?: string;
}

export function Spinner({ size = "sm", className }: SpinnerProps) {
  return (
    <div className={cn("min-h-full", "grid place-items-center")}>
      <div className="flex flex-col items-center gap-4">
        <div className={cn(spinnerVariants({ size, className }))} />
      </div>
    </div>
  );
}
