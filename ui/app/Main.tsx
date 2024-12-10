"use client";

import { useCoAgentStateRender } from "@copilotkit/react-core";
import { CopilotChat } from "@copilotkit/react-ui";
import { Progress } from "./components/ui/Progress";
import { MainLayout } from './components/layouts/MainLayout';
import { useAgentState } from './hooks/useAgentState';
import { AgentState } from './lib/types/state';
import { CHAT_CONFIG } from './lib/constants';
import { AgentCapabilities } from './components/AgentCapabilities';
import GeneratedPosts from './components/GeneratedPosts';
import WriterExamples from './components/WriterExamples';
import ContentItems from './components/ContentItems';
import { TooltipProvider } from './components/ui/tooltip';
import { Card } from './components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { useAppTheme } from './hooks/useAppTheme';

export function Main() {
  const { agentState, isLoading, ...handlers } = useAgentState();
  const { theme, chatTheme } = useAppTheme();

  useCoAgentStateRender({
    name: "Social Media Agent",
    render: ({ state }: { state: AgentState }) => 
      state.logs?.length ? <Progress logs={state.logs} /> : null
  });

  return (
    <TooltipProvider>
      <MainLayout 
        sidebar={
          <div style={chatTheme as any}>
            <CopilotChat {...CHAT_CONFIG} />
          </div>
        }
      >
        <div className="space-y-8">
          <Card className="p-6 bg-card border-border">
            <h1 className="text-2xl font-bold text-gradient mb-3">
              Dashboard
            </h1>
            <p className="text-muted-foreground mb-4">
              Your AI-powered social media content assistant. Here&apos;s what you can do:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              {[
                {
                  title: "1. Train Your AI",
                  description: "Add writing examples to help the AI understand and mimic your unique style."
                },
                {
                  title: "2. Generate Content",
                  description: "Get AI-generated LinkedIn posts that match your writing style and tone. Post to LinkedIn with a single click."
                },
                {
                  title: "3. Manage Sources",
                  description: "View and edit the source content used to generate your posts."
                }
              ].map((item, index) => (
                <div key={index} className="bg-card/50 p-4 rounded-lg border border-border">
                  <h3 className="font-semibold text-gradient mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </Card>

          <AgentCapabilities />

          <Card className="p-6">
            <Tabs defaultValue="examples" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="examples">
                  Writing Examples
                </TabsTrigger>
                <TabsTrigger value="posts">
                  Generated Posts
                </TabsTrigger>
                <TabsTrigger value="content">
                  Content Sources
                </TabsTrigger>
              </TabsList>
              <TabsContent value="examples" className="mt-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                  </div>
                  <WriterExamples
                    examples={agentState?.writer_examples || []}
                    onExampleUpdate={handlers.handleExampleUpdate}
                    onAddExample={handlers.handleAddExample}
                    onDeleteExample={handlers.handleDeleteExample}
                    isLoading={isLoading}
                  />
                </div>
              </TabsContent>
              <TabsContent value="posts" className="mt-6">
                <div className="space-y-4">
                  <GeneratedPosts 
                    posts={agentState?.generated_posts || []}
                    onPostUpdate={handlers.handlePostUpdate}
                    onAddPost={handlers.handleAddPost}
                    onDeletePost={handlers.handleDeletePost}
                    isLoading={isLoading}
                  />
                </div>
              </TabsContent>
              <TabsContent value="content" className="mt-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">

                  </div>
                  <ContentItems 
                    items={agentState?.content_items || []}
                    onContentUpdate={handlers.handleContentUpdate}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </MainLayout>
    </TooltipProvider>
  );
}
