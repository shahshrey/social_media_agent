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
import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"

interface GeneratedPostsProps {
  posts: string[];
  onPostUpdate?: (index: number, newContent: string) => void;
  onAddPost?: (content: string) => void;
  onDeletePost?: (index: number) => void;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001';

// Dynamically import heavy components
const ReactMarkdown = dynamic(() => import('react-markdown'), {
  loading: () => <div className="animate-pulse h-4 bg-gray-200 rounded w-full" />
});

const GeneratedPosts = ({ posts, onPostUpdate, onAddPost, onDeletePost }: GeneratedPostsProps) => {
  const { components } = useTheme();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editContent, setEditContent] = useState<string>('');
  const [postingToLinkedIn, setPostingToLinkedIn] = useState<number | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');

  console.log('GeneratedPosts Component State:', {
    posts,
    expandedIndex,
    editingIndex,
    editContent,
    postingToLinkedIn,
  });

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

  const handleDelete = (index: number, e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (onDeletePost) {
      onDeletePost(index);
    }
  };

  const handleAddNewPost = () => {
    setNewPostContent('Write your new post here...');
    setDialogOpen(true);
  };

  const handleSaveNewPost = () => {
    if (onAddPost && newPostContent.trim()) {
      onAddPost(newPostContent);
      setDialogOpen(false);
      setNewPostContent('');
    }
  };

  const handleCancelNewPost = () => {
    setDialogOpen(false);
    setNewPostContent('');
  };

  const renderPostHeader = (post: string, index: number) => (
    <div className={`prose prose-sm max-w-none whitespace-pre-line ${expandedIndex === index ? '' : 'line-clamp-3'}`}>
      <ReactMarkdown>
        {post.split('\n')[0]}
      </ReactMarkdown>
    </div>
  );

  const renderPostActions = (index: number, post: string) => (
    <div className="flex flex-wrap gap-2 sm:flex-nowrap">
      <Button
        variant="ghost"
        size="icon"
        onClick={(e) => handleLinkedInPost(post, index, e)}
        className="h-8 w-8 hover:bg-blue-100 relative touch-manipulation"
        disabled={postingToLinkedIn === index}
      >
        {postingToLinkedIn === index ? (
          <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />
        ) : (
          <Linkedin className="h-4 w-4 text-blue-600" />
        )}
      </Button>
      <div className="tooltip" data-tip="Share on LinkedIn">
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => handleShare(post, e)}
          className="h-8 w-8 hover:bg-indigo-100"
        >
          <Share2 className="h-4 w-4 text-indigo-600" />
        </Button>
      </div>
      <div className="tooltip" data-tip="Edit">
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => handleEdit(index, post, e)}
          className="h-8 w-8 hover:bg-indigo-100"
        >
          <Pencil className="h-4 w-4 text-indigo-600" />
        </Button>
      </div>
      <div className="tooltip" data-tip="Delete">
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => handleDelete(index, e)}
          className="h-8 w-8 hover:bg-red-100"
        >
          <X className="h-4 w-4 text-red-600" />
        </Button>
      </div>
    </div>
  );

  const handleSwipe = (index: number, direction: 'left' | 'right') => {
    if (direction === 'left') {
      handleDelete(index, new MouseEvent('click') as any);
    } else if (direction === 'right') {
      handleShare(posts[index], new MouseEvent('click') as any);
    }
  };

  const EmptyState = () => (
    <Card className="border-2 border-dashed border-indigo-200 transition-all hover:border-indigo-300">
      <CardContent className="p-8 text-center">
        <div className="mb-4">
          <Share2 className="h-12 w-12 text-indigo-400 mx-auto" />
        </div>
        <h3 className="text-lg font-semibold text-indigo-600 mb-2">
          Start Creating LinkedIn Posts
        </h3>
        <p className="text-sm text-gray-500 mt-2">
          Create professional content that resonates with your network
        </p>
        <Button 
          onClick={handleAddNewPost}
          className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          Create Your First Post
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className={components.text.gradient}>
          LinkedIn Posts
        </h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
              size="sm"
            >
              Add Post
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create New LinkedIn Post</DialogTitle>
            </DialogHeader>
            <div className="mt-4">
              <EditableContent
                content={newPostContent}
                onChange={setNewPostContent}
                onSave={handleSaveNewPost}
                onCancel={(e) => handleCancelNewPost()}
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>
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
                  onSave={(e) => handleSave(index, e as React.MouseEvent<HTMLButtonElement>)}
                  onCancel={(e) => handleCancel(e as React.MouseEvent<HTMLButtonElement>)}
                />
              ) : (
                <div className="prose prose-sm max-w-none prose-indigo bg-white whitespace-pre-line">
                  <ReactMarkdown>{post}</ReactMarkdown>
                </div>
              )}
            </ExpandableCard>
          ))
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
};

export default GeneratedPosts; 