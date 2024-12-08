import { useCoAgent } from "@copilotkit/react-core";
import { AgentState } from "../lib/types/state";
import { useState } from 'react';

const initialState: AgentState = {
  messages: [{ content: "" }],
  content_items: [
  ],
  generated_posts: [  ],
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