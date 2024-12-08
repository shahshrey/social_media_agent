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

export function Main() {
  const { agentState, isLoading, ...handlers } = useAgentState();

  useCoAgentStateRender({
    name: "Social Media Agent",
    render: ({ state }: { state: AgentState }) => 
      state.logs?.length ? <Progress logs={state.logs} /> : null
  });

  return (
    <TooltipProvider>
      <MainLayout sidebar={<CopilotChat {...CHAT_CONFIG} />}>
        <div className="space-y-8">
          <Card className="p-6 bg-gradient-to-r from-indigo-50 to-blue-50 border-none">
            <h1 className="text-2xl font-bold text-indigo-900 mb-3">
             Dashboard
            </h1>
            <p className="text-indigo-700 mb-4">
              Your AI-powered social media content assistant. Here&apos;s what you can do:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-white/50 p-4 rounded-lg">
                <h3 className="font-semibold text-indigo-900 mb-2">1. Train Your AI</h3>
                <p className="text-indigo-700">Add writing examples to help the AI understand and mimic your unique style.</p>
              </div>
              <div className="bg-white/50 p-4 rounded-lg">
                <h3 className="font-semibold text-indigo-900 mb-2">2. Generate Content</h3>
                <p className="text-indigo-700">Get AI-generated LinkedIn posts that match your writing style and tone. Post to LinkedIn with a single click.</p>
              </div>
              <div className="bg-white/50 p-4 rounded-lg">
                <h3 className="font-semibold text-indigo-900 mb-2">3. Manage Sources</h3>
                <p className="text-indigo-700">View and edit the source content used to generate your posts.</p>
              </div>
            </div>
          </Card>

          <AgentCapabilities />

          <Card className="p-6">
            <Tabs defaultValue="examples" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="examples" className="data-[state=active]:bg-indigo-50">
                  Writing Examples
                </TabsTrigger>
                <TabsTrigger value="posts" className="data-[state=active]:bg-indigo-50">
                  Generated Posts
                </TabsTrigger>
                <TabsTrigger value="content" className="data-[state=active]:bg-indigo-50">
                  Content Sources
                </TabsTrigger>
              </TabsList>
              <TabsContent value="examples" className="mt-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-indigo-900">Writing Examples</h2>
                    <p className="text-sm text-indigo-600">Add examples to help AI understand your style</p>
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
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-indigo-900">Generated Posts</h2>
                    <p className="text-sm text-indigo-600">View and manage your AI-generated posts</p>
                  </div>
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
                    <h2 className="text-xl font-semibold text-indigo-900">Content Sources</h2>
                    <p className="text-sm text-indigo-600">Manage your content source materials</p>
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
