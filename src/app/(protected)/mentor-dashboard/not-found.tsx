import MaxWidthWrapper from "@/components/max-width-wrapper";
import { buttonVariants } from "@/components/ui/button";
import { ArrowRight, TriangleAlert } from "lucide-react";
import Link from "next/link";

const NotFound = () => {
  return (
    <MaxWidthWrapper className="flex-1 flex justify-center items-center">
      <div className="my-16 p-32 rounded-lg flex flex-col items-center gap-4 ring ring-gray-100">
        <TriangleAlert className="size-32 stroke-brand-200" />
        <p className="text-2xl">This page doesn&apos;t exist</p>
        <Link className={buttonVariants({})} href="/">
          Go Back to Home
          <ArrowRight />
        </Link>
      </div>
    </MaxWidthWrapper>
  );
};

export default NotFound;
