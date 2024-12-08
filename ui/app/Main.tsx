"use client";

import { useCoAgentStateRender } from "@copilotkit/react-core";
import { CopilotChat } from "@copilotkit/react-ui";
import { Progress } from "./components/ui/Progress";
import GeneratedPosts from './components/GeneratedPosts';
import { MainLayout } from './components/layouts/MainLayout';
import { useAgentState } from './hooks/useAgentState';
import WriterExamples from './components/WriterExamples';
import { AgentState } from './lib/types/state';
import ContentItems from './components/ContentItems';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./components/ui/collapsible";
import { ChevronDown } from "lucide-react"; // For the collapse indicator
import { useThemeStyles } from './hooks/useThemeStyles';

const CHAT_CONFIG = {
  className: "h-full",
  instructions: "You are assisting the user as best as you can. Answer in the best way possible given the data you have.",
  labels: {
    title: "Your AI Assistant",
    initial: "Hi! 👋 I'm here to help you create social media posts. I can create content from sources like Reddit, LinkedIn, YouTube, or Towards Data Science, feel free to ask!",
  }
};

export function Main() {
  const { agentState, isLoading, ...handlers } = useAgentState();
  const styles = useThemeStyles();

  useCoAgentStateRender({
    name: "Social Media Agent",
    render: ({ state }: { state: AgentState }) => 
      state.logs?.length ? <Progress logs={state.logs} /> : null
  });

  return (
    <MainLayout sidebar={<CopilotChat {...CHAT_CONFIG} />}>
      <div className="space-y-8">
        <Collapsible>
          <CollapsibleTrigger 
            className={`flex w-full items-center justify-between rounded-lg 
              ${styles.card.base} 
              ${styles.card.hover}
              bg-background-subtle p-4`}
          >
            <h2 className={`text-lg font-semibold ${styles.text.gradient}`}>Writer Examples</h2>
            <ChevronDown className="h-5 w-5 text-slate" />
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-4">
            <WriterExamples
              examples={agentState?.writer_examples || []}
              onExampleUpdate={handlers.handleExampleUpdate}
              onAddExample={handlers.handleAddExample}
              onDeleteExample={handlers.handleDeleteExample}
              isLoading={isLoading}
            />
          </CollapsibleContent>
        </Collapsible>

        <Collapsible>
          <CollapsibleTrigger 
            className={`flex w-full items-center justify-between rounded-lg 
              ${styles.card.base} 
              ${styles.card.hover}
              bg-background-subtle p-4`}
          >
            <h2 className={`text-lg font-semibold ${styles.text.gradient}`}>Generated Posts</h2>
            <ChevronDown className="h-5 w-5 text-slate" />
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-4">
            <GeneratedPosts 
              posts={agentState?.generated_posts || []}
              onPostUpdate={handlers.handlePostUpdate}
              onAddPost={handlers.handleAddPost}
              onDeletePost={handlers.handleDeletePost}
              isLoading={isLoading}
            />
          </CollapsibleContent>
        </Collapsible>

        <Collapsible>
          <CollapsibleTrigger 
            className={`flex w-full items-center justify-between rounded-lg 
              ${styles.card.base} 
              ${styles.card.hover}
              bg-background-subtle p-4`}
          >
            <h2 className={`text-lg font-semibold ${styles.text.gradient}`}>Sources</h2>
            <ChevronDown className="h-5 w-5 text-slate" />
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-4">
            <ContentItems 
              items={agentState?.content_items || []}
              onContentUpdate={handlers.handleContentUpdate}
            />
          </CollapsibleContent>
        </Collapsible>
      </div>
    </MainLayout>
  );
}
