"use client";

import { CopilotKit } from "@copilotkit/react-core";
import { Main } from "../Main";
import { Toaster } from "sonner";
import "@copilotkit/react-ui/styles.css";

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

export default function Dashboard() {
  return (
    <main className="min-h-screen w-full overflow-x-hidden">
      <Toaster {...TOASTER_CONFIG} />
      <CopilotKit {...COPILOT_CONFIG}>
        <Main />
      </CopilotKit>
    </main>
  );
} 