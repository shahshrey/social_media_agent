"use client";

import { CopilotKit } from "@copilotkit/react-core";
import { Main } from "./Main";
import { Toaster } from "sonner";
import "@copilotkit/react-ui/styles.css";
import { LandingPage } from "./components/LandingPage";

const COPILOT_CONFIG = {
  runtimeUrl: "/api/copilotkit",
  agent: "Social Media Agent",
  showDevConsole: false,
};

const TOASTER_CONFIG = {
  position: "bottom-left" as const,
  expand: true,
  richColors: true,
  closeButton: true,
};

export default function Home() {
  // Check if we're on the landing page path
  const isLandingPage = typeof window !== 'undefined' && window.location.pathname === '/';

  return (
    <main className="h-screen w-full">
      <Toaster {...TOASTER_CONFIG} />
      {isLandingPage ? (
        <LandingPage />
      ) : (
        <CopilotKit {...COPILOT_CONFIG}>
          <Main />
        </CopilotKit>
      )}
    </main>
  );
}
