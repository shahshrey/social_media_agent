import ReactMarkdown from 'react-markdown';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Share2, Pencil, Save, X } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardHeader, CardContent } from "./ui/card"
import { Button } from "./ui/button"
import { ExpandableCard } from './ui/ExpandableCard';
import { EditableContent } from './EditableContent';
import { toastConfig } from './ui/toast';
import { useTheme } from '../providers/ThemeProvider';

interface GeneratedPostsProps {
  posts: string[];
  onPostUpdate?: (index: number, newContent: string) => void;
}

const GeneratedPosts = ({ posts, onPostUpdate }: GeneratedPostsProps) => {
  const { components } = useTheme();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editContent, setEditContent] = useState<string>('');

  const handleEdit = (index: number, content: string, e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setEditingIndex(index);
    setEditContent(content);
  };

  const handleSave = (index: number, e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (onPostUpdate) {
      onPostUpdate(index, editContent);
    }
    setEditingIndex(null);
  };

  const handleCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setEditingIndex(null);
  };

  const handleShare = async (post: string, e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    
    // Copy to clipboard
    try {
      await navigator.clipboard.writeText(post);
      toast.success('Post copied to clipboard!', toastConfig.success);
    } catch (err) {
      toast.error('Failed to copy post', toastConfig.error);
    }
    
    // Open LinkedIn share dialog
    const linkedInShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}&summary=${encodeURIComponent(post)}`;
    window.open(linkedInShareUrl, '_blank', 'width=600,height=600');
  };

  const renderPostHeader = (post: string, index: number) => (
    <div className={`prose prose-sm max-w-none whitespace-pre-line ${expandedIndex === index ? '' : 'line-clamp-3'}`}>
      <ReactMarkdown>
        {post.split('\n')[0]}
      </ReactMarkdown>
    </div>
  );

  const renderPostActions = (index: number, post: string) => (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={(e) => handleShare(post, e)}
        className="h-8 w-8 hover:bg-indigo-100"
      >
        <Share2 className="h-4 w-4 text-indigo-600" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={(e) => handleEdit(index, post, e)}
        className="h-8 w-8 hover:bg-indigo-100"
      >
        <Pencil className="h-4 w-4 text-indigo-600" />
      </Button>
    </>
  );

  return (
    <div className="space-y-6">
      <h2 className={components.text.gradient}>
        Generated Posts
      </h2>
      <div className={`${components.card.base} ${components.card.hover}`}>
        {posts && posts.length > 0 ? (
          posts.map((post, index) => (
            <ExpandableCard
              key={index}
              index={index}
              isExpanded={expandedIndex === index}
              onToggle={() => setExpandedIndex(expandedIndex === index ? null : index)}
              header={renderPostHeader(post, index)}
              actions={renderPostActions(index, post)}
            >
              {editingIndex === index ? (
                <EditableContent
                  content={editContent}
                  onChange={setEditContent}
                  onSave={(e) => handleSave(index, e)}
                  onCancel={handleCancel}
                />
              ) : (
                <div className="prose prose-sm max-w-none prose-indigo bg-white whitespace-pre-line">
                  <ReactMarkdown>{post}</ReactMarkdown>
                </div>
              )}
            </ExpandableCard>
          ))
        ) : (
          <Card className="border-2 border-dashed border-indigo-200">
            <CardContent className="p-8 text-center">
              <p className="text-indigo-600">No generated posts available</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default GeneratedPosts; 