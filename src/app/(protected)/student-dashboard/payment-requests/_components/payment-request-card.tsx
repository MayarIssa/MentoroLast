"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { DollarSign, Clock, Target, MapPin, Briefcase } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import useAuth from "@/hooks/use-auth";
import { paymentsMutations } from "@/lib/api/mutations/payments";
import { FormFileUploader } from "@/components/form-file-uploader";
import { useTranslations } from "next-intl";
import { FaPaypal } from "react-icons/fa";
import { paypalMutations } from "@/lib/api/mutations/paypal";
import { Spinner } from "@/components/spinner";
import { API_URL } from "@/lib/constants";

type MentorDetails = {
  name: string;
  email: string;
  image: string;
  jobTitle: string;
  about: string;
  location: string;
  spotleft: number;
  category: string;
  linkedin: string;
  github: string;
  mentorPlans: {
    roadmapPlan: {
      title: string;
      description: string;
      duration: string;
      price: number;
    };
    customPlan: {
      title: string;
      description: string;
      duration: string;
      price: number;
    };
    consultantPlan: {
      title: string;
      description: string;
      duration: string;
      price: number;
    };
  };
};

type PaymentRequestData = {
  mentorId: string;
  mentorName: string;
  goal: string;
  planTitle: string;
  status: string;
  mentorDetails: MentorDetails;
  planDetails: {
    id: number;
    title: string;
    description: string;
    duration: string;
    price: number;
  };
};

const paymentFormSchema = z.object({
  senderAccount: z.string().min(1, { message: "sender_account_required" }),
  transactionImage: z
    .array(z.instanceof(File))
    .min(1, { message: "transaction_image_required" })
    .max(1, { message: "transaction_image_max" }),
});

type PaymentFormData = z.infer<typeof paymentFormSchema>;

interface PaymentRequestCardProps {
  request: PaymentRequestData;
}

export function PaymentRequestCard({ request }: PaymentRequestCardProps) {
  const t = useTranslations("PaymentRequestCard");
  const [isProcessing, setIsProcessing] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { user } = useAuth();

  const form = useForm<PaymentFormData>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      senderAccount: "",
      transactionImage: [],
    },
  });

  const [isPending, startTransition] = useTransition();

  const handlePayWithPaypal = async () => {
    startTransition(async () => {
      const url = await paypalMutations.createPayment({
        Amount: request.planDetails.price,
        RoadManpId: request.planDetails.id,
        RoadMapTitle: request.planDetails.title,
        mentorId: Number(request.mentorId),
      });

      if (url) {
        window.location.href = url.url;
      }
    });
  };

  const handleConfirmPayment = async (data: PaymentFormData) => {
    if (!user) {
      toast.error(t("auth_error_toast"));
      return;
    }

    setIsProcessing(true);

    try {
      const transactionImage = data.transactionImage[0];
      if (!transactionImage) {
        toast.error(t("image_error_toast"));
        return;
      }

      const success = await paymentsMutations.confirmPayment({
        Amount: request.planDetails.price.toString(),
        ResevationAccount: "ibrahim2903@instapay",
        SenderAccount: data.senderAccount,
        Image: transactionImage,
        UserId: user.userId,
        mentorId: request.mentorId,
        RoadmapPlanId: request.planDetails.id.toString(),
        RoadmapPlanTitle: request.planDetails.title,
      });

      if (success) {
        toast.success(t("success_toast", { mentorName: request.mentorName }));
        setDialogOpen(false);
        form.reset();
      } else {
        toast.error(t("error_toast"));
      }
    } catch (error) {
      toast.error(t("error_toast"));
      console.error("Payment error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <Card className="border-border transition-all duration-200 hover:shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <Avatar className="border-primary/20 h-12 w-12 border-2">
              <AvatarImage
                src={`${API_URL}${request.mentorDetails.image}`}
                alt={request.mentorName}
              />
              <AvatarFallback className="bg-primary/10">
                {request.mentorName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <CardTitle className="truncate text-lg">
                {request.mentorName}
              </CardTitle>
              <CardDescription className="flex items-center gap-1 truncate">
                <Briefcase className="h-3 w-3" />
                {request.mentorDetails.jobTitle}
              </CardDescription>
            </div>
            <Badge variant="secondary" className="text-xs">
              {t(
                `status.${request.status}` as
                  | "status.Accepted"
                  | "status.pending",
                { status: request.status },
              )}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="bg-muted/50 space-y-2 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold">
                {t("plan_title", { title: request.planDetails.title })}
              </h4>
              <div className="text-primary flex items-center gap-1 font-bold">
                <DollarSign className="h-4 w-4" />
                <span>
                  {t("price_label", { price: request.planDetails.price })}
                </span>
              </div>
            </div>
            <p className="text-muted-foreground line-clamp-2 text-xs">
              {request.planDetails.description}
            </p>
            <div className="text-muted-foreground flex items-center gap-1 text-xs">
              <Clock className="h-3 w-3" />
              <span>
                {t("duration_label", {
                  duration: request.planDetails.duration,
                })}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Target className="text-primary h-4 w-4" />
              <span className="text-sm font-medium">{t("goal_label")}</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {request.goal}
            </p>
          </div>

          <div className="text-muted-foreground flex items-center gap-2 text-sm">
            <MapPin className="h-3 w-3" />
            <span>
              {t("location_label", {
                location: request.mentorDetails.location,
              })}
            </span>
          </div>

          <DialogTrigger asChild>
            <Button className="w-full">{t("pay_now_button")}</Button>
          </DialogTrigger>
        </CardContent>
      </Card>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("dialog_title")}</DialogTitle>
          <DialogDescription>
            {t("dialog_description", {
              account: "ibrahim2903@instapay",
            })}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <Button
            className="flex w-full items-center justify-center gap-2"
            onClick={handlePayWithPaypal}
            disabled={isPending}
          >
            {isPending ? (
              <Spinner />
            ) : (
              <>
                <FaPaypal className="text-2xl" />
                <span>{t("pay_with_paypal")}</span>
              </>
            )}
          </Button>

          <div className="text-muted-foreground my-2 flex items-center justify-center text-sm">
            <span>{t("or_separator")}</span>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleConfirmPayment)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="senderAccount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("sender_account_label")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("sender_account_placeholder")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage>
                      {form.formState.errors.senderAccount &&
                        t(
                          form.formState.errors.senderAccount
                            .message as "sender_account_required",
                        )}
                    </FormMessage>
                  </FormItem>
                )}
              />
              <FormFileUploader
                name="transactionImage"
                label={t("transaction_image_label")}
              />
              <Button type="submit" className="w-full" disabled={isProcessing}>
                {isProcessing
                  ? t("processing_button")
                  : t("confirm_payment_button")}
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
