import { Role, TextMessage } from '@copilotkit/runtime-client-gql';

export const CHAT_CONFIG = {
  className: "h-full",
  instructions: "You are assisting the user as best as you can. Answer in the best way possible given the data you have.",
  labels: {
    title: "Your AI Assistant",
    initial: "Hi! I'm here to help you create social media posts. I can create content from sources like Reddit, LinkedIn, YouTube, or Towards Data Science, feel free to ask!",
  }
};
export const AGENT_CAPABILITIES = [
    {
      title: "LinkedIn Profile Posts",
      examples: [
        "Create LinkedIn posts from the 3 most recent LinkedIn posts from shrey's linkedin profile, his profile id is shreyshahh",
        "Create LinkedIn posts from the latest posts from ruben's linkedin profile, his profile id is ruben-hassid",
      ]
    },
    {
      title: "Reddit Summaries", 
      examples: [
        "Create LinkedIn posts from the 3 latest posts from the LangChain subreddit",
        "Create LinkedIn posts from the top discussions from r/MachineLearning this week",
        "Create LinkedIn posts from trending r/Technology discussions"
      ]
    },
    {
      title: "Towards Data Science Articles",
      examples: [
        "Create LinkedIn posts from the 3 top articles from Towards Data Science",
        "Create LinkedIn posts from recent TDS articles about LLMs",
        "Create LinkedIn posts from popular TDS articles about data visualization techniques"
      ]
    },
    {
      title: "YouTube Transcription",
      examples: [
        "Create LinkedIn posts from the transcript of this YouTube video https://www.youtube.com/watch?v=usOmwLZNVuM",
      ]
    },
    {
      title: "Audio Transcription -- coming soon",
      examples: [
        "Create LinkedIn posts from my podcast episode",
        "Create LinkedIn posts from my conference talk recording",
      ]
    }
  ] as const; 

export const createUserMessage = (content: string) => new TextMessage({
  id: crypto.randomUUID(),
  role: Role.User,
  content
}); 