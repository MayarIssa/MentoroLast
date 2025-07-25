import { AlertCircle } from "lucide-react";
import { notFound } from "next/navigation";

export default async function CancelPage({
  searchParams,
}: {
  searchParams: Promise<{ token: string }>;
}) {
  const token = (await searchParams).token;
  if (!token) {
    return notFound();
  }

  return (
    <div className="flex flex-col items-center gap-4 py-32 text-center">
      <AlertCircle className="size-16 text-red-500" />
      <h1 className="text-2xl font-bold">Payment cancelled</h1>
      <p className="text-muted-foreground max-w-sm text-lg">
        Your payment has been cancelled. You can try again later.
      </p>
    </div>
  );
}
