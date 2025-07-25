"use client";

import { cn } from "@/lib/utils";
import RegisterForm from "./register-form";
import MentorForm from "./mentor-form";
import LoginForm from "./login-form";
import { ResetPasswordForm } from "./reset-password-form";

interface FormsPanelProps {
  isRightPanel: boolean;
  isLogin: boolean;
  isRegister: boolean;
  onSwitchToRegister: () => void;
  onSwitchToMentorRegister: () => void;
  onSwitchToLogin: () => void;
  onSwitchToResetPassword: () => void;
}

const FormsPanel = ({
  isRightPanel,
  isLogin,
  isRegister,
  onSwitchToRegister,
  onSwitchToMentorRegister,
  onSwitchToLogin,
  onSwitchToResetPassword,
}: FormsPanelProps) => {
  return (
    <div
      className={cn(
        "absolute transition-all duration-500 ease-in-out",
        // Mobile (vertical positioning)
        "inset-x-0 h-1/2",
        isRightPanel ? "top-1/2" : "top-0",
        // Desktop (horizontal positioning)
        "lg:inset-x-auto lg:inset-y-0 lg:h-full lg:w-1/2",
        isRightPanel ? "lg:left-1/2" : "lg:left-0",
      )}
    >
      <div className="bg-card flex h-full flex-col items-center justify-center gap-4 rounded-lg p-2">
        <div className="scroll-shadow w-full overflow-y-auto rounded-lg px-4 py-2">
          <div
            className={cn(
              "w-full py-8",
              isRightPanel
                ? "opacity-100"
                : "pointer-events-none absolute opacity-0",
            )}
          >
            {isLogin ? (
              <LoginForm switchToResetPassword={onSwitchToResetPassword} />
            ) : (
              <ResetPasswordForm switchToLoginAction={onSwitchToLogin} />
            )}
          </div>

          <div
            className={cn(
              "w-full py-8 transition-opacity duration-500",
              !isRightPanel
                ? "opacity-100"
                : "pointer-events-none absolute opacity-0",
            )}
          >
            {isRegister ? (
              <RegisterForm switchToMentorRegister={onSwitchToMentorRegister} />
            ) : (
              <MentorForm switchToRegister={onSwitchToRegister} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormsPanel;
