"use client";

import { useState } from "react";
import ContentPanel from "./content-panel";
import FormsPanel from "./forms-panel";
import BackgroundLayers from "./background-layers";

const AuthPanel = () => {
  const [isRightPanel, setIsRightPanel] = useState(true);
  const [isLogin, setIsLogin] = useState(true);
  const [isRegister, setIsRegister] = useState(false);

  const switchPanels = () => {
    setIsRightPanel((prev) => !prev);
    setIsLogin((prev) => !prev);
    setIsRegister((prev) => !prev);
  };

  const switchToRegister = () => {
    setIsLogin(false);
    setIsRegister(true);
  };

  const switchToMentorRegister = () => {
    setIsLogin(false);
    setIsRegister(false);
  };

  const switchToLogin = () => {
    setIsLogin(true);
    setIsRegister(false);
  };

  const switchToResetPassword = () => {
    setIsLogin(false);
    setIsRegister(false);
  };

  return (
    <div className="relative overflow-hidden rounded-xl p-1 shadow">
      <div className="relative min-h-[64rem] lg:grid lg:min-h-[45rem] lg:grid-cols-2">
        <ContentPanel
          isRightPanel={isRightPanel}
          onSwitchPanels={switchPanels}
        />

        <FormsPanel
          isRightPanel={isRightPanel}
          isLogin={isLogin}
          isRegister={isRegister}
          onSwitchToRegister={switchToRegister}
          onSwitchToLogin={switchToLogin}
          onSwitchToResetPassword={switchToResetPassword}
          onSwitchToMentorRegister={switchToMentorRegister}
        />
      </div>

      <BackgroundLayers />
    </div>
  );
};

export default AuthPanel;
