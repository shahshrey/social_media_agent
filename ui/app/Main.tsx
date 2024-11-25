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
      content_items: [
        {
          "lc": 1,
          "type": "not_implemented",
          "id": [
            "backend",
            "schema",
            "schema",
            "ContentItem"
          ],
          "repr": "ContentItem(content=\"**Tracking Token Usage for Azure ChatOpenAI: A Guide for Developers**\\n\\nIn the rapidly evolving landscape of AI and machine learning, understanding and managing resource usage is crucial for developers working with language models. A common challenge faced by developers using Azure ChatOpenAI with Langchain PromptTemplate in Python is tracking token usage and calculating associated costs. This article delves into effective strategies for monitoring token consumption, ensuring that developers can optimize their applications both in terms of performance and cost-efficiency.\\n\\nOne of the primary concerns raised is the difficulty in accessing token usage data directly from the LLM calls. While the original OpenAI library provides token usage information in the LLM response, this feature seems to be less straightforward in the Langchain implementation. To address this, several tools and methods have been suggested by the community. Langfuse, for instance, is a recommended solution that can be hosted using Docker, offering a seamless way to track token usage. Additionally, Langsmith is another tool that provides similar tracking capabilities, allowing developers to gain insights into their token consumption.\\n\\nThe discussion highlights the importance of integrating these tools into the development workflow to maintain transparency and control over resource usage. By leveraging such tools, developers can not only monitor their token usage but also make informed decisions about scaling and cost management. This proactive approach is essential in a field where computational resources can quickly become a significant expense.\\n\\nThe conversation around this topic also underscores the collaborative nature of the developer community, with professionals sharing insights and solutions to common challenges. This exchange of knowledge is invaluable, fostering innovation and efficiency in AI development. As developers continue to explore and implement these tracking solutions, the collective learning will undoubtedly lead to more refined and cost-effective applications.\\n\\nIn conclusion, tracking token usage in Azure ChatOpenAI is a critical task for developers aiming to optimize their applications. By utilizing tools like Langfuse and Langsmith, developers can gain a clearer understanding of their resource consumption, ultimately leading to better performance and cost savings. This focus on efficiency and transparency is not only beneficial for individual projects but also contributes to the broader advancement of AI technologies. For more detailed guidance on integrating these tools, visit [Langfuse's integration guide](https://langfuse.com/guides/cookbook/integration_azure_openai_langchain).\")"
        },
        {
          "lc": 1,
          "type": "not_implemented",
          "id": [
            "backend",
            "schema",
            "schema",
            "ContentItem"
          ],
          "repr": "ContentItem(content='**Title: Navigating the Complexities of Building RAG Pipelines**\\n\\nIn the rapidly evolving landscape of data engineering and machine learning, constructing Retrieval-Augmented Generation (RAG) pipelines presents a unique set of challenges. These pipelines, which combine the strengths of retrieval systems and generative models, are pivotal in enhancing the accuracy and relevance of AI-generated content. However, the journey to building efficient RAG pipelines is fraught with technical and strategic hurdles that professionals in the field must navigate.\\n\\nOne of the primary challenges in developing RAG pipelines is the integration of diverse data sources. Ensuring seamless data retrieval from multiple repositories while maintaining data integrity and consistency is a complex task. This requires robust data management strategies and sophisticated algorithms capable of handling large volumes of data with varying structures. Additionally, the need for real-time data processing adds another layer of complexity, demanding high-performance computing resources and optimized pipeline architectures.\\n\\nAnother significant hurdle is the fine-tuning of generative models to produce contextually relevant and accurate outputs. This involves not only selecting the right model architecture but also training it with high-quality, domain-specific data. The balance between retrieval and generation is crucial; too much reliance on retrieval can limit creativity, while excessive generation can lead to inaccuracies. Professionals must also address the ethical considerations of AI-generated content, ensuring that outputs are unbiased and culturally sensitive.\\n\\nDespite these challenges, innovative solutions are emerging. Advances in natural language processing and machine learning algorithms are paving the way for more efficient RAG pipelines. Techniques such as transfer learning and reinforcement learning are being explored to enhance model performance and adaptability. Moreover, the development of open-source tools and frameworks is democratizing access to cutting-edge technologies, enabling more organizations to experiment with and implement RAG pipelines.\\n\\nIn conclusion, while building RAG pipelines is a complex endeavor, it offers immense potential for transforming how we interact with and leverage data. By addressing the technical and ethical challenges head-on, professionals can unlock new opportunities for innovation and impact in the field of AI and data science. As the technology continues to evolve, staying informed and adaptable will be key to harnessing the full potential of RAG pipelines.')"
        }
      ],
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
