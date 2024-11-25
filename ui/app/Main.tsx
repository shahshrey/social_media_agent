"use client";

import { useCoAgent, useCoAgentStateRender, useCopilotChat } from "@copilotkit/react-core";
import { CopilotPopup } from "@copilotkit/react-ui";
import { TextMessage, MessageRole } from "@copilotkit/runtime-client-gql";
import { CopilotChat } from "@copilotkit/react-ui";
import { Progress } from "./components/ui/Progress";
import ContentItems from './components/ContentItems';
import { AgentState } from "./lib/types";

export function Main() {
  const {
    state: agentState,
  } = useCoAgent<AgentState>({
    name: "Social Media Agent",
    initialState: { 
      messages: [{ content: "" }],
      content_items: [],
    },
  });

  console.log("Agent State:", agentState);

  useCoAgentStateRender({
    name: "Social Media Agent",
    render: ({ state, nodeName, status }) => {
      if (!state.logs || state.logs.length === 0) {
        return null;
      }
      return <Progress logs={state.logs} />;
    },
  });

  return (
    <div className="flex h-full w-full">
      {/* Main content area */}
      <div className="flex-1 p-6 overflow-y-auto">
        <pre className="mb-4 p-2 bg-gray-100 rounded">
          {/* Debug: {JSON.stringify(agentState, null, 2)} */}
        </pre>
        <ContentItems items={agentState?.content_items || []} />
      </div>
      
      {/* Right sidebar for chat */}
      <div className="w-96 border-l border-gray-200">
        <CopilotChat
          className="h-full"
          instructions={"You are assisting the user as best as you can. Answer in the best way possible given the data you have. Talk like a pirate."}
          labels={{
            title: "Your Assistant",
            initial: "Hi! 👋 How can I assist you today?",
          }}
        />
      </div>
    </div>
  );
}
