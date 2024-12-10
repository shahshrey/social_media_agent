"use client";

import { Card } from "./ui/card";
import { AGENT_CAPABILITIES } from '../lib/constants';
import { useCopilotChat } from "@copilotkit/react-core";
import { createUserMessage } from '../lib/constants';
import { useAppTheme } from '../hooks/useAppTheme';

export function AgentCapabilities() {
  const { theme } = useAppTheme();
  const { appendMessage } = useCopilotChat();

  const handleExampleClick = async (example: string) => {
    if (!appendMessage) {
      console.error('appendMessage is not available');
      return;
    }
    
    await appendMessage(createUserMessage(example));
  };

  return (
    <div className="rounded-lg bg-card text-card-foreground p-4">
      <h2 className={`text-lg font-semibold ${theme.text.gradient} mb-4`}>
        Quick actions
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {AGENT_CAPABILITIES.map((category, idx) => (
          <Card key={idx} className={`p-4 ${theme.card.base} border-border`}>
            <h3 className={`text-md font-semibold mb-3 ${theme.text.gradient}`}>
              {category.title}
            </h3>
            <ul className="space-y-2">
              {category.examples.map((example, i) => (
                <button 
                  key={i} 
                  className={`w-full text-left text-sm p-2 rounded-md
                    ${theme.card.hover}
                    hover:bg-primary hover:text-primary-foreground
                    bg-background/50 text-muted-foreground
                    transition-colors duration-200`}
                  onClick={() => handleExampleClick(example)}
                >
                  &quot;{example}&quot;
                </button>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </div>
  );
} 