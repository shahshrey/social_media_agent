import { useState } from 'react';
import { Pencil, Save, X, Loader2 } from 'lucide-react';
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { ExpandableCard } from './ui/ExpandableCard';
import { EditableContent } from './EditableContent';
import { useAppTheme } from '../hooks/useAppTheme';
import dynamic from 'next/dynamic';

// Types
type Example = string;
interface WriterExamplesProps {
  examples: Example[];
  onExampleUpdate?: (index: number, newContent: string) => void;
  onAddExample?: (content: string) => void;
  onDeleteExample?: (index: number) => void;
  isLoading?: boolean;
}

// Dynamic imports
const ReactMarkdown = dynamic(() => import('react-markdown'), {
  loading: () => <div className="animate-pulse bg-[hsl(var(--layer-2))] rounded w-full h-4" />
});

const WriterExamples = ({ examples, onExampleUpdate, onAddExample, onDeleteExample, isLoading }: WriterExamplesProps) => {
  const { theme } = useAppTheme();
  const [state, setState] = useState({
    expandedIndex: null as number | null,
    editingIndex: null as number | null,
    editContent: '',
  });

  const getPreviewText = (text: string) => {
    return text.replace(/[#*`_]/g, '').slice(0, 100) + (text.length > 100 ? '...' : '');
  };

  return (
    <div className="glass rounded-xl p-6 space-y-6 backdrop-blur-lg">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-foreground">
          Add examples to help guide the AI in generating content that matches your style.
        </h2>
        <Button 
          variant="default"
          size="sm"
          onClick={() => onAddExample?.('')}
          className="bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))/90] text-primary-foreground shadow-lg shadow-primary/20"
        >
          Add Example
        </Button>
      </div>

      <div className="space-y-2">
        {examples.map((example, index) => (
          <ExpandableCard
            key={index}
            index={index}
            isExpanded={state.expandedIndex === index}
            onToggle={() => setState(s => ({ ...s, expandedIndex: s.expandedIndex === index ? null : index }))}
            header={
              <div className={`prose dark:prose-invert prose-sm max-w-none text-foreground ${state.expandedIndex === index ? '' : 'line-clamp-2'}`}>
                {getPreviewText(example)}
              </div>
            }
            actions={
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setState(s => ({ ...s, editingIndex: index, editContent: example }))}
                  className="h-8 w-8 hover:bg-[hsl(var(--layer-2))] hover:bg-opacity-70 text-primary"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteExample?.(index);
                  }}
                  disabled={isLoading}
                  className="h-8 w-8 hover:bg-destructive/10 text-destructive"
                >
                  {isLoading ? 
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" /> : 
                    <X className="h-4 w-4" />
                  }
                </Button>
              </div>
            }
          >
            {state.editingIndex === index ? (
              <EditableContent
                content={state.editContent}
                onChange={(content) => setState(s => ({ ...s, editContent: content }))}
                onSave={() => {
                  onExampleUpdate?.(index, state.editContent);
                  setState(s => ({ ...s, editingIndex: null }));
                }}
                onCancel={() => setState(s => ({ ...s, editingIndex: null }))}
              />
            ) : (
              <div className="prose dark:prose-invert prose-sm max-w-none text-foreground">
                <ReactMarkdown>{example}</ReactMarkdown>
              </div>
            )}
          </ExpandableCard>
        ))}
      </div>
    </div>
  );
};

export default WriterExamples; 