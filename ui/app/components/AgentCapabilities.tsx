"use client";

import { Card } from "./ui/card";
import { useThemeStyles } from '../hooks/useThemeStyles';
import { AGENT_CAPABILITIES } from '../lib/constants';
import { useCopilotChat } from "@copilotkit/react-core";
import { createUserMessage } from '../lib/constants';

export function AgentCapabilities() {
  const styles = useThemeStyles();
  const { appendMessage } = useCopilotChat();

  const handleExampleClick = async (example: string) => {
    if (!appendMessage) {
      console.error('appendMessage is not available');
      return;
    }
    
    await appendMessage(createUserMessage(example));
  };

  return (
    <div className={`rounded-lg ${styles.card.base} bg-background-subtle p-4`}>
      <h2 className={`text-lg font-semibold ${styles.text.gradient} mb-4`}>
        What Can This Agent Do?
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {AGENT_CAPABILITIES.map((category, idx) => (
          <Card key={idx} className={`p-4 ${styles.card.base}`}>
            <h3 className={`text-md font-semibold mb-3 ${styles.text.gradient}`}>
              {category.title}
            </h3>
            <ul className="space-y-2">
              {category.examples.map((example, i) => (
                <button 
                  key={i} 
                  className={`w-full text-left text-sm p-2 rounded-md
                    ${styles.card.hover}
                    hover:bg-background-subtle transition-colors`}
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