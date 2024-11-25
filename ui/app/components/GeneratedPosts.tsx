import ReactMarkdown from 'react-markdown';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Share2, Pencil, Save, X } from 'lucide-react';
import { toast } from 'sonner';

interface GeneratedPostsProps {
  posts: string[];
  onPostUpdate?: (index: number, newContent: string) => void;
}

const GeneratedPosts = ({ posts, onPostUpdate }: GeneratedPostsProps) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editContent, setEditContent] = useState<string>('');

  const handleEdit = (index: number, content: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingIndex(index);
    setEditContent(content);
  };

  const handleSave = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onPostUpdate) {
      onPostUpdate(index, editContent);
    }
    setEditingIndex(null);
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingIndex(null);
  };

  const handleShare = async (post: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Copy to clipboard
    try {
      await navigator.clipboard.writeText(post);
      toast.success('Post copied to clipboard');
    } catch (err) {
      toast.error('Failed to copy post');
    }
    
    // Open LinkedIn share dialog
    const linkedInShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}&summary=${encodeURIComponent(post)}`;
    window.open(linkedInShareUrl, '_blank', 'width=600,height=600');
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
        Generated Posts
      </h2>
      <div className="space-y-4">
        {posts && posts.length > 0 ? (
          posts.map((post, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                type: "spring",
                stiffness: 100,
                damping: 15,
                delay: index * 0.1 
              }}
              className="glass rounded-xl overflow-hidden hover-card"
            >
              <div 
                onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/50 transition-colors"
              >
                <div className="flex-1 pr-4">
                  <div className={`prose prose-sm max-w-none ${expandedIndex === index ? '' : 'line-clamp-3'}`}>
                    <ReactMarkdown>
                      {post.split('\n')[0]}
                    </ReactMarkdown>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => handleShare(post, e)}
                    className="p-2 hover:bg-indigo-50 rounded-full transition-all duration-200"
                    aria-label="Share post"
                  >
                    <Share2 className="w-4 h-4 text-indigo-600" />
                  </button>
                  <button
                    onClick={(e) => handleEdit(index, post, e)}
                    className="p-2 hover:bg-indigo-50 rounded-full transition-all duration-200"
                    aria-label="Edit post"
                  >
                    <Pencil className="w-4 h-4 text-indigo-600" />
                  </button>
                  {expandedIndex === index ? (
                    <ChevronUp className="w-5 h-5 text-indigo-600" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-indigo-600" />
                  )}
                </div>
              </div>
              
              <AnimatePresence>
                {expandedIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden border-t border-indigo-100"
                  >
                    <div className="p-4 bg-white/50">
                      {editingIndex === index ? (
                        <div className="space-y-4">
                          <textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            className="w-full h-64 p-3 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                            onClick={(e) => e.stopPropagation()}
                          />
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={(e) => handleCancel(e)}
                              className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => handleSave(index, e)}
                              className="px-4 py-2 text-sm text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors"
                            >
                              <Save className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="prose prose-sm max-w-none prose-indigo">
                          <ReactMarkdown>{post}</ReactMarkdown>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))
        ) : (
          <div className="rounded-xl border-2 border-dashed border-indigo-200 p-8 text-center">
            <p className="text-indigo-600">No generated posts available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GeneratedPosts; 