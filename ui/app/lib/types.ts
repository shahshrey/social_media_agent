export interface ContentItem {
  summary: string;
}

export interface AgentState {
  messages: any[];
  logs?: any[];
  content_items?: ContentItem[];
  next_action?: string;
  generated_posts?: string[];
}
