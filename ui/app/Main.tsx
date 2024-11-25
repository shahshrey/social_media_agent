"use client";

import { useCoAgent, useCoAgentStateRender, useCopilotChat } from "@copilotkit/react-core";
import { CopilotPopup } from "@copilotkit/react-ui";
import { CopilotChat } from "@copilotkit/react-ui";
import { Progress } from "./components/ui/Progress";
import ContentItems from './components/ContentItems';
import { AgentState } from "./lib/types";
import GeneratedPosts from './components/GeneratedPosts';

export function Main() {
  const {
    state: agentState,
  } = useCoAgent<AgentState>({
    name: "Social Media Agent",
    initialState: { 
      messages: [{ content: "" }],
      content_items: [],
      generated_posts: [
        "Tracking token usage in Azure ChatOpenAI is a game-changer for developers.\n\nHere's why ↓\n\nIn the fast-paced world of AI and machine learning, managing resources is crucial. Developers using Azure ChatOpenAI with Langchain PromptTemplate in Python face a common challenge: tracking token usage and calculating costs.\n\nBut there's a solution.\n\n→ Langfuse: Host it with Docker for seamless token tracking.\n→ Langsmith: Offers similar capabilities for insights into token consumption.\n\nThese tools are essential for optimizing performance and cost-efficiency. They help developers monitor usage, make informed scaling decisions, and manage costs effectively.\n\nThe developer community is buzzing with shared insights and solutions. This collaboration fosters innovation and efficiency in AI development.\n\nBy integrating these tools, developers can achieve better performance and cost savings. It's not just about individual projects; it's about advancing AI technologies as a whole.\n\nFor more detailed guidance, check out [Langfuse's integration guide](https://langfuse.com/guides/cookbook/integration_azure_openai_langchain).\n\n♻️ Repost this if you think it's the future.\n\nPS: If you want to stay updated with genAI\n\n1. Scroll to the top.\n2. Follow Shrey Shah to never miss a post.\n\n#AI #MachineLearning #Azure #TokenTracking #Langchain #Innovation #CostEfficiency",
        "RAG pipelines are the future of AI content creation.\n\nHere's why they're a game-changer:\n\n→ They combine retrieval systems with generative models.\n→ They enhance accuracy and relevance in AI-generated content.\n→ They require seamless integration of diverse data sources.\n\nBut let's be real:\n\nBuilding RAG pipelines isn't easy.\n\nChallenges include:\n- Integrating data from multiple repositories.\n- Maintaining data integrity and consistency.\n- Fine-tuning generative models for contextually relevant outputs.\n\nYet, innovation is on our side.\n\nAdvances in NLP and machine learning are paving the way:\n- Transfer learning and reinforcement learning are boosting model performance.\n- Open-source tools are democratizing access to cutting-edge tech.\n\nThe potential is immense.\n\nBy tackling these challenges, we can transform data interaction and leverage AI like never before.\n\n♻️ Repost this if you think it's the future.\n\nPS: If you want to stay updated with genAI\n\n1. Scroll to the top.\n2. Follow Shrey Shah to never miss a post.\n\n#AI #DataScience #MachineLearning #Innovation #RAGpipelines"
      ],
    },
  });

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
    <div className="flex flex-col lg:flex-row h-full w-full">
      {/* Main content area */}
      <div className="flex-1 p-4 lg:p-6 overflow-y-auto space-y-6">
        <div className="bg-white rounded-xl shadow-lg p-6 space-y-8">
          <ContentItems items={agentState?.content_items || []} />
          <GeneratedPosts posts={agentState?.generated_posts || []} />
        </div>
      </div>
      
      {/* Right sidebar for chat */}
      <div className="w-full lg:w-96 border-t lg:border-l border-gray-200">
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
