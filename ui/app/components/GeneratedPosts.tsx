import ReactMarkdown from 'react-markdown';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Share2, Pencil, Save, X, Linkedin, Loader2 } from 'lucide-react';
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

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001';

const GeneratedPosts = ({ posts, onPostUpdate }: GeneratedPostsProps) => {
  const { components } = useTheme();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editContent, setEditContent] = useState<string>('');
  const [postingToLinkedIn, setPostingToLinkedIn] = useState<number | null>(null);

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
    
    try {
      await navigator.clipboard.writeText(post);
      toast.success('LinkedIn post copied to clipboard!', toastConfig.success);
    } catch (err) {
      toast.error('Failed to copy post', toastConfig.error);
    }
    
    const shareText = `Share this post on LinkedIn to grow your professional network and engage with your audience!`;
    const linkedInShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}&summary=${encodeURIComponent(post)}`;
    
    toast.message(shareText, {
      ...toastConfig.info,
      action: {
        label: 'Open LinkedIn',
        onClick: () => window.open(linkedInShareUrl, '_blank', 'width=600,height=600')
      },
    });
  };

  const handleLinkedInPost = async (post: string, index: number, e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setPostingToLinkedIn(index);
    
    // Show initial loading toast
    const toastId = toast.loading('Initiating LinkedIn post...', {
      ...toastConfig.info,
      duration: Infinity,
    });

    try {
      // Update progress
      toast.loading('Posting to LinkedIn...', {
        id: toastId,
        ...toastConfig.info,
      });

      const response = await fetch(`${API_BASE_URL}/api/linkedin/post`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: post }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to post to LinkedIn');
      }

      // Success toast
      toast.success('Successfully posted to LinkedIn!', {
        id: toastId,
        ...toastConfig.success,
        duration: 3000,
      });
    } catch (err) {
      console.error('LinkedIn post error:', err);
      // Error toast
      toast.error(
        err instanceof Error ? err.message : 'Failed to post to LinkedIn',
        {
          id: toastId,
          ...toastConfig.error,
          duration: 3000,
        }
      );
    } finally {
      setPostingToLinkedIn(null);
    }
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
        onClick={(e) => handleLinkedInPost(post, index, e)}
        className="h-8 w-8 hover:bg-blue-100 relative"
        disabled={postingToLinkedIn === index}
      >
        {postingToLinkedIn === index ? (
          <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />
        ) : (
          <Linkedin className="h-4 w-4 text-blue-600" />
        )}
      </Button>
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
        LinkedIn Posts
      </h2>
      <p className="text-sm text-gray-600 mb-4">
        Review these posts and edit them to your liking and then click on the share button to post them to LinkedIn.
      </p>
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
              <p className="text-indigo-600">Generate your first LinkedIn post to get started</p>
              <p className="text-sm text-gray-500 mt-2">Create professional content that resonates with your network</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default GeneratedPosts; 