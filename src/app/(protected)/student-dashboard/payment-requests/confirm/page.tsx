import { Button } from "@/components/ui/button";
import { paymentsQueries } from "@/lib/api/queries/payments";
import { AlertCircle, CheckCircle } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function ConfirmPage({
  searchParams,
}: {
  searchParams: Promise<{ token: string }>;
}) {
  const { token } = await searchParams;

  if (!token) {
    return notFound();
  }

  const data = await paymentsQueries.capturePaypalPayment(token);

  if (data.statusCode !== 200) {
    return (
      <div className="flex flex-col items-center gap-4 py-32 text-center">
        <AlertCircle className="size-16 text-red-500" />
        <h1 className="text-2xl font-bold">Error</h1>
        <p className="text-muted-foreground text-lg">{data.reportMessage}</p>
        <Button asChild>
          <Link href="/student-dashboard/payment-requests">
            Go back to payment requests
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 py-32 text-center">
      <CheckCircle className="size-16 text-green-500" />
      <h1 className="text-2xl font-bold">Payment successful!</h1>
      <p className="text-muted-foreground max-w-sm text-lg">
        Your payment has been successful. You can now start your mentorship.
      </p>
      <Button asChild>
        <Link href="/student-dashboard/your-mentors">Go to your mentors</Link>
      </Button>
    </div>
  );
}
