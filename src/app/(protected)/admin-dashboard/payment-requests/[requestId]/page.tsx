import { API } from "@/lib/api";
import { PaymentRequestDetails } from "../_components/payment-request-details";
import { notFound } from "next/navigation";

export default async function PaymentRequestPage({
  params,
}: {
  params: Promise<{ requestId: string }>;
}) {
  const { requestId } = await params;

  try {
    const paymentRequest = await API.queries.admin.getPaymentRequestById(
      Number(requestId),
    );

    return <PaymentRequestDetails request={paymentRequest} />;
  } catch {
    notFound();
  }
}
