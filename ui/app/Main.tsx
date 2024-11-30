"use client";

import { useCoAgentStateRender } from "@copilotkit/react-core";
import { CopilotChat } from "@copilotkit/react-ui";
import { Progress } from "./components/ui/Progress";
import ContentItems from './components/ContentItems';
import GeneratedPosts from './components/GeneratedPosts';
import { MainLayout } from './components/layouts/MainLayout';
import { useAgentState } from './hooks/useAgentState';

export function Main() {
  const { agentState, handleContentUpdate, handlePostUpdate, handleAddPost, handleDeletePost } = useAgentState();

  console.log('Main Component State:', {
    content_items: agentState?.content_items,
    generated_posts: agentState?.generated_posts,
  });

  useCoAgentStateRender({
    name: "Social Media Agent",
    render: ({ state }) => {
      if (!state.logs?.length) return null;
      return <Progress logs={state.logs} />;
    },
  });

  const chatSidebar = (
    <CopilotChat
      className="h-full"
      instructions={"You are assisting the user as best as you can. Answer in the best way possible given the data you have."}
      labels={{
        title: "Your AI Assistant",
        initial: "Hi! 👋 I'm your AI social media assistant. How can I help you create engaging content today?",
      }}
    />
  );

  return (
    <MainLayout sidebar={chatSidebar}>
      <ContentItems 
        items={agentState?.content_items?.map(item => ({...item, summary: ''})) || []}
        onContentUpdate={handleContentUpdate}
      />
      <GeneratedPosts 
        posts={agentState?.generated_posts || []}
        onPostUpdate={handlePostUpdate}
        onAddPost={handleAddPost}
        onDeletePost={handleDeletePost}
      />
    </MainLayout>
  );
}
