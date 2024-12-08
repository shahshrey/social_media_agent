import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp, Share2, Pencil, Save, X, Linkedin, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { ExpandableCard } from './ui/ExpandableCard';
import { EditableContent } from './EditableContent';
import { toastConfig } from './ui/toast';
import { useAppTheme } from '../hooks/useAppTheme';
import dynamic from 'next/dynamic';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { MouseEvent } from 'react';

// Types
type Post = string;
interface GeneratedPostsProps {
  posts: Post[];
  onPostUpdate?: (index: number, newContent: string) => void;
  onAddPost?: (content: string) => void;
  onDeletePost?: (index: number) => void;
  isLoading?: boolean;
}

// Constants
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Dynamic imports
const ReactMarkdown = dynamic(() => import('react-markdown'), {
  loading: () => <div className="animate-pulse h-4 bg-gray-200 rounded w-full" />
});

// Components
const EmptyState = ({ onAdd }: { onAdd: () => void }) => (
  <Card className="border-2 border-dashed border-indigo-200 transition-all hover:border-indigo-300">
    <CardContent className="p-8 text-center">
      <Share2 className="h-12 w-12 text-indigo-400 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-indigo-600 mb-2">
        Start Creating LinkedIn Posts
      </h3>
      <p className="text-sm text-gray-500 mt-2">
        Create professional content that resonates with your network
      </p>
      <Button 
        onClick={onAdd}
        className="mt-4"
        variant="default"
      >
        Create Your First Post
      </Button>
    </CardContent>
  </Card>
);

const GeneratedPosts = ({ posts, onPostUpdate, onAddPost, onDeletePost, isLoading }: GeneratedPostsProps) => {
  const { theme } = useAppTheme();
  const [state, setState] = useState({
    expandedIndex: null as number | null,
    editingIndex: null as number | null,
    editContent: '',
    postingToLinkedIn: null as number | null,
    dialogOpen: false,
    newPostContent: ''
  });

  // Handlers
  const handleLinkedInPost = async (post: string, index: number, e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setState(s => ({ ...s, postingToLinkedIn: index }));
    
    const toastId = toast.loading('Posting to LinkedIn...', { ...toastConfig.info, duration: Infinity });

    try {
      const response = await fetch(`${API_BASE_URL}/api/linkedin/post`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: post }),
      });

      if (!response.ok) {
        throw new Error((await response.json()).detail || 'Failed to post to LinkedIn');
      }

      toast.success('Successfully posted to LinkedIn!', {
        id: toastId,
        ...toastConfig.success,
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to post to LinkedIn', {
        id: toastId,
        ...toastConfig.error,
      });
    } finally {
      setState(s => ({ ...s, postingToLinkedIn: null }));
    }
  };

  const handleShare = async (post: string, e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    
    try {
      await navigator.clipboard.writeText(post);
      const linkedInShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}&summary=${encodeURIComponent(post)}`;
      
      toast.message('Post copied to clipboard!', {
        ...toastConfig.success,
        action: {
          label: 'Open LinkedIn',
          onClick: () => window.open(linkedInShareUrl, '_blank', 'width=600,height=600')
        },
      });
    } catch (err) {
      toast.error('Failed to copy post', toastConfig.error);
    }
  };

  const renderPostActions = (index: number, post: string) => (
    <div className="flex gap-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e: MouseEvent<HTMLButtonElement>) => handleLinkedInPost(post, index, e)}
            className="h-8 w-8"
            disabled={state.postingToLinkedIn === index}
          >
            {state.postingToLinkedIn === index ? 
              <Loader2 className="h-4 w-4 text-blue-600 animate-spin" /> : 
              <Linkedin className="h-4 w-4 text-blue-600" />
            }
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Post to LinkedIn</p>
        </TooltipContent>
      </Tooltip>

      {[
        { 
          tip: "Share", 
          icon: <Share2 className="h-4 w-4 text-indigo-600" />, 
          onClick: (e: MouseEvent<HTMLButtonElement>) => handleShare(post, e) 
        },
        { 
          tip: "Edit", 
          icon: <Pencil className="h-4 w-4 text-indigo-600" />, 
          onClick: (e: MouseEvent<HTMLButtonElement>) => setState(s => ({ 
            ...s, 
            editingIndex: index, 
            editContent: post 
          })) 
        },
        { 
          tip: "Delete", 
          icon: isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4 text-red-600" />, 
          onClick: (e: MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation();
            onDeletePost?.(index);
          },
          disabled: isLoading 
        }
      ].map(({ tip, icon, onClick, disabled }) => (
        <Tooltip key={tip}>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClick}
              disabled={disabled}
              className={`h-8 w-8 hover:bg-${tip === "Delete" ? "red" : "indigo"}-100`}
            >
              {icon}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{tip}</p>
          </TooltipContent>
        </Tooltip>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
      <h2 className="text-xl font-semibold text-gradient">Review and edit these posts before sharing them on LinkedIn.</h2>
      
        <Dialog open={state.dialogOpen} onOpenChange={(open: boolean) => setState(s => ({ ...s, dialogOpen: open }))}>
          <DialogTrigger asChild>
            <Button 
              variant="default"
              size="sm"
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              Add Post
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create New LinkedIn Post</DialogTitle>
            </DialogHeader>
            <EditableContent
              content={state.newPostContent}
              onChange={(content) => setState(s => ({ ...s, newPostContent: content }))}
              onSave={() => {
                if (state.newPostContent.trim()) {
                  onAddPost?.(state.newPostContent);
                  setState(s => ({ ...s, dialogOpen: false, newPostContent: '' }));
                }
              }}
              onCancel={() => setState(s => ({ ...s, dialogOpen: false, newPostContent: '' }))}
            />
          </DialogContent>
        </Dialog>
      </div>
      <div className={`${theme.card.base} ${theme.card.hover}`}>
        {posts.length > 0 ? (
          posts.map((post, index) => (
            <ExpandableCard
              key={index}
              index={index}
              isExpanded={state.expandedIndex === index}
              onToggle={() => setState(s => ({ ...s, expandedIndex: s.expandedIndex === index ? null : index }))}
              header={
                <div className={`prose prose-sm max-w-none whitespace-pre-line ${state.expandedIndex === index ? '' : 'line-clamp-3'}`}>
                  <ReactMarkdown>{post.split('\n')[0]}</ReactMarkdown>
                </div>
              }
              actions={renderPostActions(index, post)}
            >
              {state.editingIndex === index ? (
                <EditableContent
                  content={state.editContent}
                  onChange={(content) => setState(s => ({ ...s, editContent: content }))}
                  onSave={() => {
                    onPostUpdate?.(index, state.editContent);
                    setState(s => ({ ...s, editingIndex: null }));
                  }}
                  onCancel={() => setState(s => ({ ...s, editingIndex: null }))}
                />
              ) : (
                <div className="prose prose-sm max-w-none prose-indigo bg-white whitespace-pre-line">
                  <ReactMarkdown>{post}</ReactMarkdown>
                </div>
              )}
            </ExpandableCard>
          ))
        ) : (
          <EmptyState onAdd={() => setState(s => ({ ...s, dialogOpen: true, newPostContent: 'Write your new post here...' }))} />
        )}
      </div>
    </div>
  );
};

export default GeneratedPosts; 