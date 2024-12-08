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
import { Card } from "./components/ui/card";

const CHAT_CONFIG = {
  className: "h-full",
  instructions: "You are assisting the user as best as you can. Answer in the best way possible given the data you have.",
  labels: {
    title: "Your AI Assistant",
    initial: "Hi! 👋 I'm here to help you create social media posts. I can create content from sources like Reddit, LinkedIn, YouTube, or Towards Data Science, feel free to ask!",
  }
};

const AGENT_CAPABILITIES = [
  {
    title: "Content Research",
    examples: [
      "Find the latest posts about AI from the LangChain subreddit",
      "Get the top 3 articles from Towards Data Science about machine learning",
      "Fetch recent LinkedIn posts from Andrej Karpathy's profile"
    ]
  },
  {
    title: "Content Creation",
    examples: [
      "Create a Twitter thread about the latest AI developments from Reddit",
      "Write a LinkedIn post summarizing this YouTube video: [video_url]",
      "Generate a blog post based on the top TDS articles about data science"
    ]
  },
  {
    title: "Transcription & Analysis",
    examples: [
      "Transcribe this YouTube video and create social media posts from key points",
      "Analyze the trending topics from these LinkedIn posts",
      "Summarize these Reddit discussions into bite-sized content"
    ]
  }
];

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
        <Collapsible defaultOpen>
          <CollapsibleTrigger 
            className={`flex w-full items-center justify-between rounded-lg 
              ${styles.card.base} 
              ${styles.card.hover}
              bg-background-subtle p-4`}
          >
            <h2 className={`text-lg font-semibold ${styles.text.gradient}`}>What Can This Agent Do?</h2>
            <ChevronDown className="h-5 w-5 text-slate" />
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {AGENT_CAPABILITIES.map((category, idx) => (
                <Card key={idx} className={`p-4 ${styles.card.base}`}>
                  <h3 className={`text-md font-semibold mb-3 ${styles.text.gradient}`}>
                    {category.title}
                  </h3>
                  <ul className="space-y-2">
                    {category.examples.map((example, i) => (
                      <li key={i} className="text-sm cursor-pointer hover:opacity-80">
                        &quot;{example}&quot;
                      </li>
                    ))}
                  </ul>
                </Card>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Collapsible>
          <CollapsibleTrigger 
            className={`flex w-full items-center justify-between rounded-lg 
              ${styles.card.base} 
              ${styles.card.hover}
              bg-background-subtle p-4`}
          >
            <h2 className={`text-lg font-semibold ${styles.text.gradient}`}>Provide Examples to Mimic your writing style</h2>
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
            <h2 className={`text-lg font-semibold ${styles.text.gradient}`}>Tailored Generated Posts that match your writing style</h2>
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
            <h2 className={`text-lg font-semibold ${styles.text.gradient}`}>Sources of the content you're using</h2>
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
