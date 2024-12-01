import { useCoAgent } from "@copilotkit/react-core";
import { AgentState } from "../lib/types/state";
import { useState } from 'react';

const initialState: AgentState = {
  messages: [{ content: "" }],
  // content_items: [
  //   {
  //     "lc": 1,
  //     "type": "not_implemented",
  //     "id": [
  //       "backend",
  //       "schema",
  //       "schema",
  //       "ContentItem"
  //     ],
  //     "repr": "ContentItem(content=\"**Tracking Token Usage for Azure ChatOpenAI: A Guide for Developers**\\n\\nIn the rapidly evolving landscape of AI and machine learning, understanding and managing resource usage is crucial for developers working with language models. A common challenge faced by developers using Azure ChatOpenAI with Langchain PromptTemplate in Python is tracking token usage and calculating associated costs. This article delves into effective strategies for monitoring token consumption, ensuring that developers can optimize their applications both in terms of performance and cost-efficiency.\\n\\nOne of the primary concerns raised is the difficulty in accessing token usage data directly from the LLM calls. While the original OpenAI library provides token usage information in the LLM response, this feature seems to be less straightforward in the Langchain implementation. To address this, several tools and methods have been suggested by the community. Langfuse, for instance, is a recommended solution that can be hosted using Docker, offering a seamless way to track token usage. Additionally, Langsmith is another tool that provides similar tracking capabilities, allowing developers to gain insights into their token consumption.\\n\\nThe discussion highlights the importance of integrating these tools into the development workflow to maintain transparency and control over resource usage. By leveraging such tools, developers can not only monitor their token usage but also make informed decisions about scaling and cost management. This proactive approach is essential in a field where computational resources can quickly become a significant expense.\\n\\nThe conversation around this topic also underscores the collaborative nature of the developer community, with professionals sharing insights and solutions to common challenges. This exchange of knowledge is invaluable, fostering innovation and efficiency in AI development. As developers continue to explore and implement these tracking solutions, the collective learning will undoubtedly lead to more refined and cost-effective applications.\\n\\nIn conclusion, tracking token usage in Azure ChatOpenAI is a critical task for developers aiming to optimize their applications. By utilizing tools like Langfuse and Langsmith, developers can gain a clearer understanding of their resource consumption, ultimately leading to better performance and cost savings. This focus on efficiency and transparency is not only beneficial for individual projects but also contributes to the broader advancement of AI technologies. For more detailed guidance on integrating these tools, visit [Langfuse's integration guide](https://langfuse.com/guides/cookbook/integration_azure_openai_langchain).\")"
  //   },
  //   {
  //     "lc": 1,
  //     "type": "not_implemented",
  //     "id": [
  //       "backend",
  //       "schema",
  //       "schema",
  //       "ContentItem"
  //     ],
  //     "repr": "ContentItem(content='**Title: Navigating the Complexities of Building RAG Pipelines**\\n\\nIn the rapidly evolving landscape of data engineering and machine learning, constructing Retrieval-Augmented Generation (RAG) pipelines presents a unique set of challenges. These pipelines, which combine the strengths of retrieval systems and generative models, are pivotal in enhancing the accuracy and relevance of AI-generated content. However, the journey to building efficient RAG pipelines is fraught with technical and strategic hurdles that professionals in the field must navigate.\\n\\nOne of the primary challenges in developing RAG pipelines is the integration of diverse data sources. Ensuring seamless data retrieval from multiple repositories while maintaining data integrity and consistency is a complex task. This requires robust data management strategies and sophisticated algorithms capable of handling large volumes of data with varying structures. Additionally, the need for real-time data processing adds another layer of complexity, demanding high-performance computing resources and optimized pipeline architectures.\\n\\nAnother significant hurdle is the fine-tuning of generative models to produce contextually relevant and accurate outputs. This involves not only selecting the right model architecture but also training it with high-quality, domain-specific data. The balance between retrieval and generation is crucial; too much reliance on retrieval can limit creativity, while excessive generation can lead to inaccuracies. Professionals must also address the ethical considerations of AI-generated content, ensuring that outputs are unbiased and culturally sensitive.\\n\\nDespite these challenges, innovative solutions are emerging. Advances in natural language processing and machine learning algorithms are paving the way for more efficient RAG pipelines. Techniques such as transfer learning and reinforcement learning are being explored to enhance model performance and adaptability. Moreover, the development of open-source tools and frameworks is democratizing access to cutting-edge technologies, enabling more organizations to experiment with and implement RAG pipelines.\\n\\nIn conclusion, while building RAG pipelines is a complex endeavor, it offers immense potential for transforming how we interact with and leverage data. By addressing the technical and ethical challenges head-on, professionals can unlock new opportunities for innovation and impact in the field of AI and data science. As the technology continues to evolve, staying informed and adaptable will be key to harnessing the full potential of RAG pipelines. For more detailed guidance on integrating these tools, visit [Langfuse's integration guide](https://langfuse.com/guides/cookbook/integration_azure_openai_langchain).\")"
  //   }
  // ],
  // generated_posts: [
  //   "Tracking token usage in Azure ChatOpenAI is a game-changer for developers.\n\nHere's why ↓\n\nIn the fast-paced world of AI and machine learning, managing resources is crucial. Developers using Azure ChatOpenAI with Langchain PromptTemplate in Python face a common challenge: tracking token usage and calculating costs.\n\nBut there's a solution.\n\n→ Langfuse: Host it with Docker for seamless token tracking.\n→ Langsmith: Offers similar capabilities for insights into token consumption.\n\nThese tools are essential for optimizing performance and cost-efficiency. They help developers monitor usage, make informed scaling decisions, and manage costs effectively.\n\nThe developer community is buzzing with shared insights and solutions. This collaboration fosters innovation and efficiency in AI development.\n\nBy integrating these tools, developers can achieve better performance and cost savings. It's not just about individual projects; it's about advancing AI technologies as a whole.\n\nFor more detailed guidance, check out [Langfuse's integration guide](https://langfuse.com/guides/cookbook/integration_azure_openai_langchain).\n\n♻️ Repost this if you think it's the future.\n\nPS: If you want to stay updated with genAI\n\n1. Scroll to the top.\n2. Follow Shrey Shah to never miss a post.\n\n#AI #MachineLearning #Azure #TokenTracking #Langchain #Innovation #CostEfficiency",
  //   "RAG pipelines are the future of AI content creation.\n\nHere's why they're a game-changer:\n\n→ They combine retrieval systems with generative models.\n→ They enhance accuracy and relevance in AI-generated content.\n→ They require seamless integration of diverse data sources.\n\nBut let's be real:\n\nBuilding RAG pipelines isn't easy.\n\nChallenges include:\n- Integrating data from multiple repositories.\n- Maintaining data integrity and consistency.\n- Fine-tuning generative models for contextually relevant outputs.\n\nYet, innovation is on our side.\n\nAdvances in NLP and machine learning are paving the way:\n- Transfer learning and reinforcement learning are boosting model performance.\n- Open-source tools are democratizing access to cutting-edge tech.\n\nThe potential is immense.\n\nBy tackling these challenges, we can transform data interaction and leverage AI like never before.\n\n♻️ Repost this if you think it's the future.\n\nPS: If you want to stay updated with genAI\n\n1. Scroll to the top.\n2. Follow Shrey Shah to never miss a post.\n\n#AI #DataScience #MachineLearning #Innovation #RAGpipelines"
  // ],
  writer_examples: [
    `
    Example 1: 
    ________
    
    
    A lot of people are not going to like this.
    
    AI employees are taking over phone calls:
    
    This is Bland AI. And it's changing everything.
    
    If businesses don't adapt to this new tech, 
    they will be left behind.
    
    What does that mean?
    
    → AI handles millions of calls 24/7.
    → AI talks in any language or voice.
    → AI integrates with data systems seamlessly.
    → AI customized for customer service, HR, or sales.
    
    Bland AI is leading this change. Period.
    
    If you haven't already,
    do it before others.
    
    ♻️ Repost this if you think it's the future.
    
    PS: If you want to stay updated with genAI
    
    1. Scroll to the top. 
    2. Follow Shrey Shah to never miss a post.
    `,
    `
    Example 2: 
    ________
    
    
    The future of household chores is here.
    
    NEO is the game-changer:
    
    AI won't empty your dishwasher, but robots will.
    
    NEO is a humanoid robot from 1X Technologies, a Norwegian startup. 
    
    This robot is unique. It has a muscle-like anatomy instead of rigid hydraulics. 
    
    This design makes it strong and gentle, just like humans. NEO can handle delicate tasks with grace.
    
    NEO stands at 1.6m tall and weighs 29kg. 
    
    NEO can carry up to 19kg and operate for 2-4 hours.
    
    NEO responds to human gestures, body language, and voice commands. 
    
    It mimics human behavior, making interactions feel natural.
    
    NEO uses embodied AI, which means it learns and adapts to its environment. 
    
    This AI system is integrated into its physical form. It understands both natural language and physical space.
    
    NEO enters a market full of innovation and competition. 
    
    Companies like Astribot, Unitree, Zhiyuan, Boston Dynamics, Tesla, and Figure 1 are also in the race. 
    
    They all aim to bring safe and useful humanoid robots into homes and workplaces.
    
    The future is here, and it's robotic.
    
    ♻️ Repost this if you think it's the future.
    
    PS: If you want to stay updated with genAI
    
    1. Scroll to the top.
    2. Follow Shrey Shah to never miss a post.
    `,
    `
    Example 3:
    ___________
    
    
    Sora (from OpenAI) is making waves.
    
    It's not just another video tool:
    
    It's about...
    
    → Creating minute-long videos with intricate scenes
    → Competing with Runway, Luma, and Kling
    → Visualizing text inputs accurately
    
    You might think, "What about limitations?"
    
    Sure.
    
    Sora struggles with physical accuracy & continuity.
    
    But OpenAI is working on it. 
    
    They are constantly developing & testing to improve.
    
    The result:
    
    Users get ultra-realistic videos with detailed backgrounds and specific movements.
    
    They can even combine image & video tools.
    
    Trust me:
    
    This is the future of video creation.
    
    And in my experience, it's pushing boundaries every day. It's not just a tool. It's a game-changer.
    
    The only problem? It's not accessible...
    
    ...and its competitors are.
    
    ♻️ Repost this if you think it's the future. 
    
    PS: If you want to stay updated with genAI
    
    1. Scroll to the top. 
    2. Follow Shrey Shah to never miss a post.
    `,
    `
    Example 4: 
    _________
    
    
    Kolors Virtual Try-On AI is a game-changer.
    
    Here's why ↓
    
    Share this post to support the future of fashion technology.
    
    According to the latest innovations:
    
    • Users can seamlessly transfer any clothes onto a base image,
    • Creating a realistic and immersive try-on experience,
    • Compatible with popular AI image generators like Midjourney, Flux, and Mystic.
    
    In recent years, we've seen significant advancements in product visualization.
    
    And I am a living example of this:
    ↳ An advocate for cutting-edge technology.
    ↳ Embracing tools that enhance efficiency and reduce costs.
    
    But the potential of this technology is not fully realized.
    
    Committing to integrating AI in fashion is not a short-term goal.
    
    Without constant attention to innovation,
    we risk missing out on a revolution in the fashion industry.
    
    ♻️ Repost this if you think it's great.
    
    PS: If you want to stay updated with genAI
    
    1. Scroll to the top. 
    2. Follow Shrey Shah to never miss a post.
    `,
    `
    Example 5: 
    ____________
    
    AI is evolving at a breakneck speed.
    
    ↳ It can now create almost lifelike videos.
    ↳ The difference in just one year is stunning.
    
    A year ago, AI-generated videos were often glitchy and unrealistic.
    
    For example, the AI video of Will Smith eating spaghetti was called "nightmarish." 
    
    Faces were all wrong, and the video lacked fluidity.
    
    Today, things are totally different.
    
    AI has improved so quickly that the same video now looks almost real. 
    
    The side-by-side comparison is shocking.
    
    Here's how AI has evolved:
    
    1) More realistic and detailed scenes.
    2) Complex camera motions.
    3) Multiple characters with vibrant emotions.
    4) Enhanced fluidity and realism.
    5) Better handling of facial expressions.
    6) Improved background details.
    7) Higher quality in visual effects.
    8) Enhanced lighting and shadows.
    9) Faster processing times.
    
    AI is getting better at creating lifelike videos.
    
    The more we talk about it,
    the more we understand its rapid progress.
    
    ♻️ Repost this if you think it's the future.
    
    PS: If you want to stay updated with genAI
    
    1. Scroll to the top. 
    2. Follow Shrey Shah to never miss a post.
    `,
  ],
};

export const useAgentState = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { state: agentState, setState: setAgentState } = useCoAgent<AgentState>({
    name: "Social Media Agent",
    initialState,
  });

  // Add debug logging
  console.log('Current Agent State:', {
    messages: agentState?.messages,
    content_items: agentState?.content_items,
    generated_posts: agentState?.generated_posts,
  });

  const handleContentUpdate = (index: number, newContent: string) => {
    if (!agentState) return;
    
    const newContentItems = [...(agentState.content_items || [])];
    newContentItems[index] = {
      ...newContentItems[index],
      repr: `ContentItem(content="${newContent.replace(/"/g, '\\"')}")`
    };
    
    setAgentState({
      ...agentState,
      content_items: newContentItems,
    });
  };

  const handlePostUpdate = async (index: number, newContent: string) => {
    if (!agentState) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const newPosts = [...(agentState.generated_posts || [])];
      newPosts[index] = newContent;
      
      await setAgentState({
        ...agentState,
        generated_posts: newPosts,
      });
    } catch (err) {
      setError('Failed to update post. Please try again.');
      console.error('Post update error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePost = async (index: number) => {
    if (!agentState) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const newPosts = [...(agentState.generated_posts || [])];
      newPosts.splice(index, 1);
      
      await setAgentState({
        ...agentState,
        generated_posts: newPosts,
      });
    } catch (err) {
      setError('Failed to delete post. Please try again.');
      console.error('Post deletion error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddPost = (content: string) => {
    if (!agentState || !content.trim()) return;
    
    const newPosts = [...(agentState.generated_posts || []), content];
    
    setAgentState({
      ...agentState,
      generated_posts: newPosts,
    });
  };

  const handleExampleUpdate = async (index: number, newContent: string) => {
    if (!agentState) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const newExamples = [...(agentState.writer_examples || [])];
      newExamples[index] = newContent;
      
      await setAgentState({
        ...agentState,
        writer_examples: newExamples,
      });
    } catch (err) {
      setError('Failed to update example. Please try again.');
      console.error('Example update error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteExample = async (index: number) => {
    if (!agentState) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const newExamples = [...(agentState.writer_examples || [])];
      newExamples.splice(index, 1);
      
      await setAgentState({
        ...agentState,
        writer_examples: newExamples,
      });
    } catch (err) {
      setError('Failed to delete example. Please try again.');
      console.error('Example deletion error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddExample = (content: string) => {
    if (!agentState || !content.trim()) return;
    
    const newExamples = [...(agentState.writer_examples || []), content];
    
    setAgentState({
      ...agentState,
      writer_examples: newExamples,
    });
  };

  return {
    agentState,
    isLoading,
    error,
    handleContentUpdate,
    handlePostUpdate,
    handleAddPost,
    handleDeletePost,
    handleExampleUpdate,
    handleAddExample,
    handleDeleteExample,
  };
}; 