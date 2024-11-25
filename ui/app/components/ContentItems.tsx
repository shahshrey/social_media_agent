import ReactMarkdown from 'react-markdown';
import { ContentItem } from "../lib/types";
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Pencil, Save, X } from 'lucide-react';

const ContentItems = ({ items, onContentUpdate }: { 
  items: ContentItem[]; 
  onContentUpdate?: (index: number, newContent: string) => void;
}) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editContent, setEditContent] = useState<string>('');

  const parseContent = (item: any) => {
    if (item.repr && typeof item.repr === 'string') {
      const match = item.repr.match(/ContentItem\(content=["'](.+?)["']\)/s);
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
      <h2 className="text-2xl font-bold text-gray-900">Content Items</h2>
      <div className="space-y-4">
        {items && items.length > 0 ? (
          items.map((item, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
            >
              <div 
                onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
              >
                <div className="flex-1 pr-4">
                  <div className={`prose prose-sm max-w-none ${expandedIndex === index ? '' : 'line-clamp-3'}`}>
                    <ReactMarkdown>
                      {parseContent(item).split('\n')[0]}
                    </ReactMarkdown>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => handleEdit(index, parseContent(item), e)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <Pencil className="w-4 h-4 text-gray-500" />
                  </button>
                  {expandedIndex === index ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </div>
              </div>
              
              <AnimatePresence>
                {expandedIndex === index && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: "auto" }}
                    exit={{ height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden border-t border-gray-100"
                  >
                    <div className="p-4 bg-gray-50">
                      {editingIndex === index ? (
                        <div className="space-y-4">
                          <textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            className="w-full h-64 p-2 border rounded-md"
                            onClick={(e) => e.stopPropagation()}
                          />
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={(e) => handleCancel(e)}
                              className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-md"
                            >
                              <X className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => handleSave(index, e)}
                              className="px-3 py-1 text-sm text-white bg-blue-500 hover:bg-blue-600 rounded-md"
                            >
                              <Save className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="prose prose-sm max-w-none">
                          <ReactMarkdown>
                            {parseContent(item)}
                          </ReactMarkdown>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))
        ) : (
          <div className="rounded-xl border-2 border-dashed border-gray-200 p-8">
            <p className="text-center text-gray-500">No content items available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentItems;