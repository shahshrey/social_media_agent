import ReactMarkdown from 'react-markdown';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Share2 } from 'lucide-react';

interface GeneratedPostsProps {
  posts: string[];
}

const GeneratedPosts = ({ posts }: GeneratedPostsProps) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const handleShare = (post: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(post);
    // You could add a toast notification here
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Generated Posts</h2>
      <div className="space-y-4">
        {posts && posts.length > 0 ? (
          posts.map((post, index) => (
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
                      {post.split('\n')[0]}
                    </ReactMarkdown>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={(e) => handleShare(post, e)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <Share2 className="w-4 h-4 text-gray-500" />
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
                      <div className="prose prose-sm max-w-none">
                        <ReactMarkdown>
                          {post}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))
        ) : (
          <div className="rounded-xl border-2 border-dashed border-gray-200 p-8">
            <p className="text-center text-gray-500">No generated posts available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GeneratedPosts; 