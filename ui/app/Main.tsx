"use client";

import { useCoAgentStateRender } from "@copilotkit/react-core";
import { CopilotChat } from "@copilotkit/react-ui";
import { Progress } from "./components/ui/Progress";
import { MainLayout } from './components/layouts/MainLayout';
import { useAgentState } from './hooks/useAgentState';
import { AgentState } from './lib/types/state';
import { CHAT_CONFIG } from './lib/constants';
import { AgentCapabilities } from './components/AgentCapabilities';
import { CollapsibleSection } from './components/CollapsibleSection';
import GeneratedPosts from './components/GeneratedPosts';
import WriterExamples from './components/WriterExamples';
import ContentItems from './components/ContentItems';

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
        <AgentCapabilities />

        <CollapsibleSection title="Provide Examples to Mimic your writing style">
          <WriterExamples
            examples={agentState?.writer_examples || []}
            onExampleUpdate={handlers.handleExampleUpdate}
            onAddExample={handlers.handleAddExample}
            onDeleteExample={handlers.handleDeleteExample}
            isLoading={isLoading}
          />
        </CollapsibleSection>

        <CollapsibleSection title="Tailored Generated Posts that match your writing style">
          <GeneratedPosts 
            posts={agentState?.generated_posts || []}
            onPostUpdate={handlers.handlePostUpdate}
            onAddPost={handlers.handleAddPost}
            onDeletePost={handlers.handleDeletePost}
            isLoading={isLoading}
          />
        </CollapsibleSection>

        <CollapsibleSection title="Sources of Content">
          <ContentItems 
            items={agentState?.content_items || []}
            onContentUpdate={handlers.handleContentUpdate}
          />
        </CollapsibleSection>
      </div>
    </MainLayout>
  );
}
