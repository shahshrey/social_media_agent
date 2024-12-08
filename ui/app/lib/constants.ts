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
        "Fetch the 3 most recent LinkedIn posts from shrey's linkedin profile, his profile id is shreyshahh and create linkedIn posts from them",
        "Get the latest posts from ruben's linkedin profile, his profile id is ruben-hassid and create linkedIn posts from them",
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
        "Transcribe this YouTube video https://www.youtube.com/watch?v=usOmwLZNVuM and create a LinkedIn post about the topics discussed",
      ]
    },
    {
      title: "Audio Transcription -- coming soon",
      examples: [
        "Transcribe this audio file and create a LinkedIn post about it",
        "Convert my podcast episode into engaging social media content",
        "Create Twitter threads from my conference talk recording"
      ]
    }
  ] as const; 

export const createUserMessage = (content: string) => new TextMessage({
  id: crypto.randomUUID(),
  role: Role.User,
  content
}); 