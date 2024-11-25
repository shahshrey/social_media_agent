export interface ContentItem {
  summary: string;
}

export interface AgentState {
  messages: { content: string }[];
  content_items: ContentItem[];
  generated_posts?: string[];
}
