import { useState } from 'react';
import { Pencil, Save, X, Loader2, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { ExpandableCard } from './ui/ExpandableCard';
import { EditableContent } from './EditableContent';
import { toastConfig } from './ui/toast';
import { useAppTheme } from '../hooks/useAppTheme';
import dynamic from 'next/dynamic';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

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
  loading: () => <div className="animate-pulse h-4 bg-gray-200 rounded w-full" />
});

// Empty state component
const EmptyState = ({ onAdd }: { onAdd: () => void }) => (
  <Card className="border-2 border-dashed border-border hover:border-primary/50 transition-all">
    <CardContent className="p-8 text-center">
      <FileText className="h-12 w-12 text-primary mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-primary mb-2">
        Add Writing Examples
      </h3>
      <p className="text-sm text-muted-foreground mt-2">
        Add examples to help guide the AI in generating content
      </p>
      <Button 
        onClick={onAdd}
        className="mt-4 bg-primary text-primary-foreground hover:bg-primary/90"
      >
        Add Your First Example
      </Button>
    </CardContent>
  </Card>
);

const WriterExamples = ({ examples, onExampleUpdate, onAddExample, onDeleteExample, isLoading }: WriterExamplesProps) => {
  const { theme } = useAppTheme();
  const [state, setState] = useState({
    expandedIndex: null as number | null,
    editingIndex: null as number | null,
    editContent: '',
    dialogOpen: false,
    newExampleContent: ''
  });
  const [activeTab, setActiveTab] = useState<'preview' | 'edit'>('preview');

  const getPreviewText = (text: string) => {
    // Get first 100 characters of the content, trimmed of markdown
    return text.replace(/[#*`_]/g, '').slice(0, 100) + (text.length > 100 ? '...' : '');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className={theme.text.gradient}>Writing Examples</h2>
        <Dialog open={state.dialogOpen} onOpenChange={(open: boolean) => setState(s => ({ ...s, dialogOpen: open }))}>
          <DialogTrigger asChild>
            <Button 
              variant="default"
              size="sm"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Add Example
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] bg-card text-card-foreground">
            <DialogHeader>
              <DialogTitle>Add Writing Example</DialogTitle>
            </DialogHeader>
            <EditableContent
              content={state.newExampleContent}
              onChange={(content) => setState(s => ({ ...s, newExampleContent: content }))}
              onSave={() => {
                if (state.newExampleContent.trim()) {
                  onAddExample?.(state.newExampleContent);
                  setState(s => ({ ...s, dialogOpen: false, newExampleContent: '' }));
                }
              }}
              onCancel={() => setState(s => ({ ...s, dialogOpen: false, newExampleContent: '' }))}
              renderEditor={(content, onChange) => (
                <Tabs defaultValue="edit" className="w-full">
                  <TabsList className="mb-4 bg-muted">
                    <TabsTrigger value="edit">Edit</TabsTrigger>
                    <TabsTrigger value="preview">Preview</TabsTrigger>
                  </TabsList>
                  <TabsContent value="edit">
                    <textarea
                      value={content}
                      onChange={(e) => onChange(e.target.value)}
                      className="w-full min-h-[200px] p-4 rounded-md border border-input 
                        bg-background text-foreground focus:outline-none 
                        focus:ring-2 focus:ring-primary"
                      placeholder="Write your example in markdown..."
                    />
                  </TabsContent>
                  <TabsContent value="preview" className="prose prose-invert prose-sm max-w-none">
                    <ReactMarkdown>{content}</ReactMarkdown>
                  </TabsContent>
                </Tabs>
              )}
            />
          </DialogContent>
        </Dialog>
      </div>

      <p className="text-sm text-muted-foreground">
        Add examples to help guide the AI in generating content that matches your style.
      </p>

      <div className={`${theme.card.base} ${theme.card.hover}`}>
        {examples?.length > 0 ? (
          examples.map((example, index) => (
            <ExpandableCard
              key={index}
              index={index}
              isExpanded={state.expandedIndex === index}
              onToggle={() => setState(s => ({ ...s, expandedIndex: s.expandedIndex === index ? null : index }))}
              header={
                <div className={`prose prose-invert prose-sm max-w-none ${state.expandedIndex === index ? '' : 'line-clamp-2'}`}>
                  {getPreviewText(example)}
                </div>
              }
              actions={
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setState(s => ({ ...s, editingIndex: index, editContent: example }))}
                    className="h-8 w-8 hover:bg-primary/10"
                  >
                    <Pencil className="h-4 w-4 text-primary" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteExample?.(index);
                    }}
                    disabled={isLoading}
                    className="h-8 w-8 hover:bg-destructive/10"
                  >
                    {isLoading ? 
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" /> : 
                      <X className="h-4 w-4 text-destructive" />
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
                  renderEditor={(content, onChange) => (
                    <Tabs defaultValue="edit" className="w-full">
                      <TabsList className="mb-4 bg-muted">
                        <TabsTrigger value="edit">Edit</TabsTrigger>
                        <TabsTrigger value="preview">Preview</TabsTrigger>
                      </TabsList>
                      <TabsContent value="edit">
                        <textarea
                          value={content}
                          onChange={(e) => onChange(e.target.value)}
                          className="w-full min-h-[200px] p-4 rounded-md border border-input 
                            bg-background text-foreground focus:outline-none 
                            focus:ring-2 focus:ring-primary"
                          placeholder="Write your example in markdown..."
                        />
                      </TabsContent>
                      <TabsContent value="preview" className="prose prose-invert prose-sm max-w-none">
                        <ReactMarkdown>{content}</ReactMarkdown>
                      </TabsContent>
                    </Tabs>
                  )}
                />
              ) : (
                <div className="prose prose-invert prose-sm max-w-none">
                  <ReactMarkdown>{example}</ReactMarkdown>
                </div>
              )}
            </ExpandableCard>
          ))
        ) : (
          <EmptyState onAdd={() => setState(s => ({ ...s, dialogOpen: true, newExampleContent: '' }))} />
        )}
      </div>
    </div>
  );
};

export default WriterExamples; 