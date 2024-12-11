"use client";

import { Card } from "./ui/card";
import { AGENT_CAPABILITIES } from '../lib/constants';
import { useCopilotChat } from "@copilotkit/react-core";
import { createUserMessage } from '../lib/constants';
import { useAppTheme } from '../hooks/useAppTheme';
import { PixelButton } from './ui/pixel-button'

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
    <div className="glass rounded-xl p-6 backdrop-blur-lg">
      <h2 className={`text-lg font-semibold ${theme.text.gradient} mb-6`}>
        Quick actions
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {AGENT_CAPABILITIES.map((category, idx) => (
          <Card 
            key={idx} 
            className={`
              glass-card
              p-5 
              transition-all 
              duration-300 
              hover:shadow-xl 
              hover:-translate-y-0.5
              hover:bg-[hsl(var(--layer-3))]
              hover:bg-opacity-95
            `}
          >
            <h3 className={`text-md font-semibold mb-4 ${theme.text.gradient}`}>
              {category.title}
            </h3>
            <ul className="space-y-3">
              {category.examples.map((example, i) => (
                <PixelButton
                  key={i}
                  className="w-full text-left text-sm p-2.5 rounded-lg
                    bg-[hsl(var(--layer-1))] bg-opacity-50
                    text-muted-foreground
                    hover:bg-[hsl(var(--layer-2))] hover:bg-opacity-70
                    hover:text-foreground
                    data-[pixel-state=active]:bg-[hsl(var(--layer-3))]
                    data-[pixel-state=active]:text-primary
                    transition-all duration-300
                    backdrop-blur-sm
                    border border-white/5"
                  onClick={() => handleExampleClick(example)}
                >
                  &quot;{example}&quot;
                </PixelButton>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </div>
  );
} 