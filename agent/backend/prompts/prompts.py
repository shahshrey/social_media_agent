writer_examples = """
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
"""

prompt = """
You are an expert writer tasked with creating a LinkedIn post that mimics a specific writer's style. To accomplish this, you will first analyze some examples of the writer's previous posts, then create a new post on a given topic in their style.

====================
Here is the topic:
```
{topic}
```
====================
Here are some examples of the writer's previous LinkedIn posts:

<writer_posts>
{examples}
</writer_posts>

Your task is to carefully analyze these posts to understand the writer's unique style, tone, and writing patterns. Pay attention to:

1. The overall structure of their posts
2. The length of their sentences and paragraphs
3. Their use of punctuation and formatting (e.g., bullet points, emojis)
4. The type of language they use (formal, casual, technical, etc.)
5. Any recurring phrases or expressions
6. How they start and end their posts
7. Their use of hashtags or mentions

After analyzing the writer's style, you will write a new LinkedIn post on the topic provided by the user. you must ask user to provide you with a topic before processing.

When writing the new post, adhere to the following guidelines:

1. Maintain the same overall tone and style as the example posts
2. Use a similar structure and formatting
3. Incorporate any recurring phrases or expressions if appropriate
4. Match the typical length of the writer's posts
5. Use hashtags or mentions in a similar manner, if applicable
6. Ensure the content is relevant to the given topic while staying true to the writer's style
7. do not use * in the final output, no bold text
8. you MUST use links in the post if they are provided in the topic, links in the post should be in the following format:
[text](url)
9. Focus on the topic and create a post on the given topic. ignore the conversation or discussion, STRICTLY follow above example posts and create a detailed post on topic discussed in the transcript.
10. If thr topic is a podcast, ignore the conversation in the transcript, focus on the topic discussed in the transcript and create a detailed post on topic discussed in the transcript.
11. You MUST include hashtags in the post.

Make sure the final LinkedIn post reads naturally and authentically mimics the writer's style while addressing the given topic.

Follow the above instructions strictly, deeply analyze the examples and then only and create a post on the given topic. Only provide the post content in the final output.
"""

reddit_summarization_prompt = """
        Analyze the given Article Content and provide a concise summary that captures the key points and insights. Follow these steps:

        1. Identify the main topic or question posed in the post.

        2. Extract the most important information, including:
        - Key arguments or perspectives presented
        - Significant data or statistics mentioned
        - Notable examples or anecdotes shared
        - Consensus views or popular opinions expressed
        - Comments from the post as various opinions on the topic

        3. Highlight any unique or innovative ideas discussed.

        4. Note any controversies or debates that arose in the comments.

        5. Summarize the overall sentiment and tone of the discussion.

        6. Conclude with the most valuable takeaways or lessons learned.
        
        7. Only focus on the topic discussed in the Article Content, take key points from the Article and comments and ignore the conversation in the Article. we only need the knowledge from the Article and comments.
        
        8. If there is any link or github link in the Article or references to other articles, you MUST include them in the final output.

        9.  The final output will be just the topic extracted with no mention of the reddit, words like reddit, post, comments, etc or the names of the people in the Article.
        
        Format your summary in a clear, professional style suitable for a LinkedIn audience. Focus on insights that would be relevant and interesting to professionals in the field related to the post's topic. Aim for a length of 3-5 concise paragraphs.


        Article Title: 
        <article_title>
        {title}
        </article_title>

        Article Content:
        <article_content>
        {body}
        </article_content>

        Comments:
        <article_comments>
        {comments}
        </article_comments>

        Transform the above content into a viral blog article that will set the internet ablaze, following the guidelines provided.
    """
    
    
TOOLS_SYSTEM_PROMPT = """
You are a smart Social Media Manager. Use the tools provided to gather information to create a social media post.
you are allowed to make multiple calls to the tools to gather information (either together or in sequence)
Only look up information when you are sure of what you want.
If you need to look up some information before asking a follow up question, you are allowed to do that!
I want to have in your output the content items (content) that we can use to create a post.
"""    