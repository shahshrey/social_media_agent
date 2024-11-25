"use client";

import { CopilotKit } from "@copilotkit/react-core";
import { Main } from "./Main";
import { Toaster } from "sonner";
import "@copilotkit/react-ui/styles.css";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-between">
      <Toaster 
        position="bottom-left" 
        expand={true}
        richColors
      />
      <CopilotKit runtimeUrl="/api/copilotkit" agent="Social Media Agent" showDevConsole={false}>
        <Main />
      </CopilotKit>
    </main>
  );
}
