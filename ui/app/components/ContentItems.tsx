import ReactMarkdown from 'react-markdown';
import { ContentItem } from "../lib/types";
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Pencil, Save, X } from 'lucide-react';
import { Card, CardHeader, CardContent } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { useTheme } from '../providers/ThemeProvider';

const ContentItems = ({ items, onContentUpdate }: { 
  items: ContentItem[]; 
  onContentUpdate?: (index: number, newContent: string) => void;
}) => {
  const { components, animation } = useTheme();
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

  return (
    <div className="space-y-6">
      <h2 className={components.text.gradient}>
        Content Items
      </h2>
      <div className="space-y-4">
        {items && items.length > 0 ? (
          items.map((item, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={animation.spring}
            >
              <Card className={`group ${components.card.base} ${components.card.hover}`}>
                <CardHeader 
                  onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                  className="cursor-pointer flex flex-row items-center justify-between space-y-0 group-hover:bg-primary-light/5 transition-all"
                  style={{ transitionDuration: animation.default }}
                >
                  <div className="flex-1 pr-4">
                    <div className={`prose prose-sm max-w-none whitespace-pre-line ${expandedIndex === index ? '' : 'line-clamp-3'}`}>
                      <ReactMarkdown>
                        {parseContent(item).split('\n')[0]}
                      </ReactMarkdown>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => handleEdit(index, parseContent(item), e)}
                      className="h-8 w-8 hover:bg-indigo-100"
                    >
                      <Pencil className="h-4 w-4 text-indigo-600" />
                    </Button>
                    <motion.div
                      animate={{ rotate: expandedIndex === index ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="h-5 w-5 text-indigo-600" />
                    </motion.div>
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
                      <CardContent className="border-t border-indigo-100 bg-white">
                        {editingIndex === index ? (
                          <div className="space-y-4">
                            <textarea
                              value={editContent}
                              onChange={(e) => setEditContent(e.target.value)}
                              className="w-full h-64 p-3 rounded-lg border border-indigo-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none bg-white whitespace-pre-line"
                              onClick={(e) => e.stopPropagation()}
                            />
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => handleCancel(e)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="default"
                                size="sm"
                                onClick={(e) => handleSave(index, e)}
                                className="bg-indigo-600 hover:bg-indigo-700"
                              >
                                <Save className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="prose prose-sm max-w-none prose-indigo bg-white whitespace-pre-line">
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
          <Card className="border-2 border-dashed border-indigo-200">
            <CardContent className="p-8 text-center">
              <p className="text-indigo-600">No content items available</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ContentItems;