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
    <div className="glass rounded-xl p-4 sm:p-6 backdrop-blur-lg bg-opacity-70 w-full overflow-x-hidden">
      <h2 className={`text-lg font-semibold ${theme.text.gradient} mb-4 sm:mb-6`}>
        Quick actions
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
        {AGENT_CAPABILITIES.map((category, idx) => (
          <Card 
            key={idx} 
            className={`
              glass-card
              p-3 sm:p-5 
              transition-all 
              duration-300 
              hover:shadow-xl 
              hover:-translate-y-0.5
              hover:bg-[hsl(var(--layer-3))]
              hover:bg-opacity-80
              bg-opacity-70
              max-w-full
              overflow-hidden
            `}
          >
            <h3 className={`text-sm sm:text-md font-semibold mb-2 sm:mb-4 ${theme.text.gradient}`}>
              {category.title}
            </h3>
            <ul className="space-y-2 sm:space-y-3">
              {category.examples.map((example, i) => (
                <PixelButton
                  key={i}
                  className="w-full text-left text-xs sm:text-sm rounded-xl
                    glass-card
                    p-2 sm:p-4
                    transition-all duration-300
                    hover:shadow-xl
                    hover:-translate-y-0.5
                    hover:bg-[hsl(var(--layer-3))]
                    hover:bg-opacity-60
                    bg-opacity-50
                    text-[hsl(var(--muted-foreground))]
                    hover:text-[hsl(var(--foreground))]
                    data-[pixel-state=active]:bg-[hsl(var(--primary))]
                    data-[pixel-state=active]:bg-opacity-15
                    data-[pixel-state=active]:text-[hsl(var(--primary))]
                    backdrop-blur-sm
                    border-[hsl(var(--border))]
                    border-opacity-10
                    break-words"
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