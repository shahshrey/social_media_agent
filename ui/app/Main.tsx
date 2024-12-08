"use client";

import { useCoAgentStateRender, useCopilotChat } from "@copilotkit/react-core";
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
import { Role, TextMessage } from '@copilotkit/runtime-client-gql';

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
    title: "LinkedIn Profile Posts",
    examples: [
      "Fetch the 3 most recent LinkedIn posts from Andrej Karpathy's linkedin profile and create linkedIn posts about it",
      "Get the latest posts from Sam Altman's LinkedIn and create engaging summaries",
      "Find viral LinkedIn posts about AI from the past week and create similar content"
    ]
  },
  {
    title: "Reddit Summaries", 
    examples: [
      "Find the 3 latest posts from the LangChain subreddit and create LinkedIn posts about it",
      "Summarize top discussions from r/MachineLearning this week",
      "Create engaging posts from trending r/Technology discussions"
    ]
  },
  {
    title: "Towards Data Science Articles",
    examples: [
      "Get the 3 top articles from Towards Data Science and create LinkedIn posts about it",
      "Find recent TDS articles about LLMs and create thread summaries",
      "Summarize popular TDS articles about data visualization techniques"
    ]
  },
  {
    title: "YouTube Transcription",
    examples: [
      "Transcribe this YouTube video and create a LinkedIn post about the topics discussed",
      "Create key takeaways from Andrew Ng's latest ML course video",
      "Generate a thread from Lex Fridman's recent AI podcast episode"
    ]
  },
  {
    title: "Audio Transcription",
    examples: [
      "Transcribe this audio file and create a LinkedIn post about it",
      "Convert my podcast episode into engaging social media content",
      "Create Twitter threads from my conference talk recording"
    ]
  }
];

export function Main() {
  const { agentState, isLoading, ...handlers } = useAgentState();
  const styles = useThemeStyles();
  const { appendMessage } = useCopilotChat();

  useCoAgentStateRender({
    name: "Social Media Agent",
    render: ({ state }: { state: AgentState }) => 
      state.logs?.length ? <Progress logs={state.logs} /> : null
  });

  return (
    <MainLayout sidebar={<CopilotChat {...CHAT_CONFIG} />}>
      <div className="space-y-8">
        <div className={`rounded-lg ${styles.card.base} bg-background-subtle p-4`}>
          <h2 className={`text-lg font-semibold ${styles.text.gradient} mb-4`}>What Can This Agent Do?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {AGENT_CAPABILITIES.map((category, idx) => (
              <Card key={idx} className={`p-4 ${styles.card.base}`}>
                <h3 className={`text-md font-semibold mb-3 ${styles.text.gradient}`}>
                  {category.title}
                </h3>
                <ul className="space-y-2">
                  {category.examples.map((example, i) => (
                    <button 
                      key={i} 
                      className={`w-full text-left text-sm p-2 rounded-md
                        ${styles.card.hover}
                        hover:bg-background-subtle transition-colors`}
                      onClick={async () => {
                        if (appendMessage) {
                          const message = new TextMessage({
                            id: crypto.randomUUID(),
                            role: Role.User,
                            content: example
                          });
                          await appendMessage(message);
                        } else {
                          console.error('appendMessage is not available');
                        }
                      }}
                    >
                      &quot;{example}&quot;
                    </button>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>

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
            <h2 className={`text-lg font-semibold ${styles.text.gradient}`}>Sources of Content</h2>
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
