"use client";

import { CopilotKit } from "@copilotkit/react-core";
import { Main } from "./Main";
import "@copilotkit/react-ui/styles.css";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-between">
      <CopilotKit runtimeUrl="/api/copilotkit" agent="Social Media Agent" showDevConsole={false}>
        <Main />
      </CopilotKit>
    </main>
  );
}
