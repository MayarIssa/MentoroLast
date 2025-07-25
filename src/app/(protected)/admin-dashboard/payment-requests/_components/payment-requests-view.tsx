"use client";

import { PaymentRequestsTable } from "./payment-requests-table";

type PaymentRequest = {
  acceptationOrRejectionDate: string;
  amount: number;
  consultantPlanId: number;
  consultantPlanTitle: string;
  customPlanId: number;
  customPlanTitle: string;
  id: number;
  image: string;
  imagePath: string;
  mentorId: number;
  mentorName: string;
  notes: string;
  requestDate: string;
  resevationAccount: string;
  roadmapPlanId: number;
  roadmapPlanTitle: string;
  senderAccount: string;
  status: string;
  userId: string;
  userName: string;
};

interface PaymentRequestsViewProps {
  requests: PaymentRequest[];
}

export function PaymentRequestsView({ requests }: PaymentRequestsViewProps) {
  return (
    <div className="space-y-6">
      <PaymentRequestsTable requests={requests} />
    </div>
  );
}
