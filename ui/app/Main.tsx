"use client";

import { useCoAgentStateRender } from "@copilotkit/react-core";
import { CopilotChat } from "@copilotkit/react-ui";
import { Progress } from "./components/ui/Progress";
import GeneratedPosts from './components/GeneratedPosts';
import { MainLayout } from './components/layouts/MainLayout';
import { useAgentState } from './hooks/useAgentState';
import WriterExamples from './components/WriterExamples';
import { AgentState } from './lib/types/state';

const CHAT_CONFIG = {
  className: "h-full",
  instructions: "You are assisting the user as best as you can. Answer in the best way possible given the data you have.",
  labels: {
    title: "Your AI Assistant",
    initial: "Hi! 👋 I'm your AI social media assistant. How can I help you create engaging content today?",
  }
};

export function Main() {
  const { agentState, isLoading, ...handlers } = useAgentState();

  useCoAgentStateRender({
    name: "Social Media Agent",
    render: ({ state }: { state: AgentState }) => 
      state.logs?.length ? <Progress logs={state.logs} /> : null
  });

  return (
    <MainLayout sidebar={<CopilotChat {...CHAT_CONFIG} />}>
      <div className="space-y-8">
        <GeneratedPosts 
          posts={agentState?.generated_posts || []}
          onPostUpdate={handlers.handlePostUpdate}
          onAddPost={handlers.handleAddPost}
          onDeletePost={handlers.handleDeletePost}
          isLoading={isLoading}
        />
        <WriterExamples
          examples={agentState?.writer_examples || []}
          onExampleUpdate={handlers.handleExampleUpdate}
          onAddExample={handlers.handleAddExample}
          onDeleteExample={handlers.handleDeleteExample}
          isLoading={isLoading}
        />
      </div>
    </MainLayout>
  );
}
