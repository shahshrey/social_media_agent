export interface ContentItem {
  lc: number;
  type: string;
  id: string[];
  repr: string;
}

export interface AgentState {
  messages: { content: string }[];
  content_items: ContentItem[];
  generated_posts: string[];
  logs?: { message: string; done: boolean }[];
}

export interface ContentUpdateHandler {
  onContentUpdate: (index: number, newContent: string) => void;
} 