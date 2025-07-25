import { Logo } from "@/components/logo";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { notFound } from "next/navigation";
import { ResetPasswordForm } from "./reset-password-form";

export default async function ResetPassword({
  searchParams,
}: {
  searchParams: Promise<{ token: string; email: string }>;
}) {
  const { token, email } = await searchParams;

  if (!token) {
    return notFound();
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <div>
        <Logo className="mb-8 scale-150" />
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Reset Password</CardTitle>
          <CardDescription>
            Please enter your new password below, This link is valid for 30
            minutes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResetPasswordForm token={token} email={email} />
        </CardContent>
      </Card>
    </div>
  );
}
