import { cn } from "@/lib/utils";

const MaxWidthWrapper = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div className={cn("container mx-auto px-4 md:px-2", className)}>
      {children}
    </div>
  );
};

export default MaxWidthWrapper;
