import ReactMarkdown from 'react-markdown';
import { ContentItem } from "../lib/types";
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Pencil, Save, X } from 'lucide-react';
import { Card, CardHeader, CardContent } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { useAppTheme } from '../hooks/useAppTheme';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

const ContentItems = ({ items, onContentUpdate }: { 
  items: ContentItem[]; 
  onContentUpdate?: (index: number, newContent: string) => void;
}) => {
  const { theme } = useAppTheme();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editContent, setEditContent] = useState<string>('');

  const parseContent = (item: any) => {
    if (item.repr && typeof item.repr === 'string') {
      const match = item.repr.match(/ContentItem\(content=["']([^]*?)["']\)/);
      return match ? match[1].replace(/\\n/g, '\n') : '';
    }
    return item.content || '';
  };

  const handleEdit = (index: number, content: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingIndex(index);
    setEditContent(content);
  };

  const handleSave = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onContentUpdate) {
      onContentUpdate(index, editContent);
    }
    setEditingIndex(null);
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingIndex(null);
  };

  const renderActionButton = (icon: React.ReactNode, label: string, onClick: (e: React.MouseEvent) => void, disabled?: boolean) => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClick}
          disabled={disabled}
          className="h-8 w-8 hover:bg-primary/10 text-primary"
        >
          {icon}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{label}</p>
      </TooltipContent>
    </Tooltip>
  );

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-foreground">
        Scraped Content
      </h2>
      <div className="space-y-2">
        {items && items.length > 0 ? (
          items.map((item, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={theme.animation.spring}
            >
              <Card className={`glass-card ${theme.card.hover}`}>
                <CardHeader 
                  onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                  className="cursor-pointer flex flex-row items-center justify-between space-y-0 hover:bg-[hsl(var(--layer-3))] hover:bg-opacity-50 transition-all rounded-t-xl"
                  style={{ transitionDuration: theme.animation.default }}
                >
                  <div className="flex-1 pr-4">
                    <div className={`prose dark:prose-invert prose-sm max-w-none text-foreground/90 ${expandedIndex === index ? '' : 'line-clamp-3'}`}>
                      <ReactMarkdown>
                        {parseContent(item).split('\n')[0]}
                      </ReactMarkdown>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {renderActionButton(
                      <Pencil className="h-4 w-4" />,
                      "Edit content",
                      (e) => handleEdit(index, parseContent(item), e)
                    )}
                    {renderActionButton(
                      expandedIndex === index ? 
                        <ChevronUp className="h-4 w-4" /> :
                        <ChevronDown className="h-4 w-4" />,
                      expandedIndex === index ? "Collapse" : "Expand",
                      () => setExpandedIndex(expandedIndex === index ? null : index)
                    )}
                  </div>
                </CardHeader>
                
                <AnimatePresence>
                  {expandedIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <CardContent className="border-t border-white/5">
                        {editingIndex === index ? (
                          <div className="space-y-4">
                            <textarea
                              value={editContent}
                              onChange={(e) => setEditContent(e.target.value)}
                              className="w-full h-64 p-3 rounded-lg border border-white/10 focus:ring-2 focus:ring-primary/30 focus:border-transparent transition-all resize-none bg-[hsl(var(--layer-1))] text-foreground/90"
                              onClick={(e) => e.stopPropagation()}
                            />
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => handleCancel(e)}
                                className="text-destructive hover:bg-destructive/10"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="default"
                                size="sm"
                                onClick={(e) => handleSave(index, e)}
                                className="bg-primary/90 hover:bg-primary text-primary-foreground"
                              >
                                <Save className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="prose dark:prose-invert prose-sm max-w-none text-foreground/90">
                            <ReactMarkdown>{parseContent(item)}</ReactMarkdown>
                          </div>
                        )}
                      </CardContent>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </motion.div>
          ))
        ) : (
          <Card className="glass-card border-2 border-dashed border-white/10">
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">No content items available</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ContentItems;