import React, { useState, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ActionButton } from '@/components/ui/action-button';
import { 
  Download, 
  Trash2, 
  Edit2, 
  X, 
  Tag as TagIcon,
  Clock,
  ChevronDown,
  ChevronUp,
  Plus,
} from 'lucide-react';
import type { Note, Tag, TagColor } from '@/hooks/useNotes';
import { NoteMeta } from './NoteMeta';
import { downloadNoteAsMarkdown } from '@/utils/downloadUtils';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface NoteCardProps {
  note: Note;
  onEdit?: (note: Note) => void;
  onDelete: (noteId: string) => void;
  onAddTag: (noteId: string, tagName: string) => void;
  onRemoveTag: (noteId: string, tagName: string) => void;
  onUpdateTagColor?: (noteId: string, tagName: string, color: TagColor) => void;
  compact?: boolean;
}

const PREVIEW_LENGTH = 80;

const TAG_COLORS: TagColor[] = [
  'default',
  'red',
  'orange',
  'yellow',
  'green',
  'blue',
  'purple',
  'pink'
];

const getNextColor = (currentColor: TagColor): TagColor => {
  const currentIndex = TAG_COLORS.indexOf(currentColor);
  return TAG_COLORS[(currentIndex + 1) % TAG_COLORS.length];
};

const getTagStyles = (color: TagColor) => {
  const styles: Record<TagColor, string> = {
    default: 'bg-primary/5 hover:bg-primary/10 text-primary/80 hover:text-primary',
    red: 'bg-red-500/10 hover:bg-red-500/20 text-red-500/80 hover:text-red-500',
    orange: 'bg-orange-500/10 hover:bg-orange-500/20 text-orange-500/80 hover:text-orange-500',
    yellow: 'bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-500/80 hover:text-yellow-500',
    green: 'bg-green-500/10 hover:bg-green-500/20 text-green-500/80 hover:text-green-500',
    blue: 'bg-blue-500/10 hover:bg-blue-500/20 text-blue-500/80 hover:text-blue-500',
    purple: 'bg-purple-500/10 hover:bg-purple-500/20 text-purple-500/80 hover:text-purple-500',
    pink: 'bg-pink-500/10 hover:bg-pink-500/20 text-pink-500/80 hover:text-pink-500'
  };
  return styles[color];
};

export const NoteCard = ({ 
  note,
  onEdit,
  onDelete,
  onAddTag,
  onRemoveTag,
  onUpdateTagColor,
  compact = false
}: NoteCardProps) => {
  const [tagInput, setTagInput] = useState('');
  const [isEditingTags, setIsEditingTags] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [localTags, setLocalTags] = useState<Tag[]>(note.tags);

  const handleAddTag = (tagName: string) => {
    if (!tagName.trim()) return;
    onAddTag(note.id, tagName);
    setTagInput('');
    setIsEditingTags(false);
  };

  const handleDownload = async () => {
    await downloadNoteAsMarkdown(note);
  };

  const handleTagClick = useCallback((tag: Tag) => {
    if (!onUpdateTagColor) return;

    const newColor = getNextColor(tag.color);
    // Update local state immediately
    setLocalTags(prevTags => 
      prevTags.map(t => 
        t.name === tag.name ? { ...t, color: newColor } : t
      )
    );
    // Update parent state
    onUpdateTagColor(note.id, tag.name, newColor);
  }, [note.id, onUpdateTagColor]);

  // Update local tags when note tags change
  React.useEffect(() => {
    setLocalTags(note.tags);
  }, [note.tags]);

  const formattedDate = format(new Date(note.updatedAt || note.createdAt), 'MMM d, HH:mm');

  const previewContent = note.content.length > PREVIEW_LENGTH 
    ? `${note.content.slice(0, PREVIEW_LENGTH)}...`
    : note.content;

  return (
    <div 
      className={cn(
        "group relative px-3 py-2 rounded-md border border-primary/10 bg-card/30",
        "backdrop-blur-sm transition-all duration-200 hover:border-primary/20 hover:bg-accent/5 w-full",
        "cursor-pointer"
      )}
    >
      <div className="flex items-center justify-between gap-2 min-w-0">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <div className="relative min-w-0 flex-1">
            <span className={cn(
              "text-sm text-foreground/90 block",
              "after:absolute after:right-0 after:top-0 after:h-full after:w-16",
              "after:bg-gradient-to-r after:from-transparent after:to-card/30",
              !isExpanded && "line-clamp-1"
            )}>
              {isExpanded ? note.content : previewContent}
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-1">
              {localTags.map(tag => (
                <Badge 
                  key={tag.name} 
                  variant="secondary" 
                  className={cn(
                    "text-xs px-1.5 h-5 transition-colors cursor-pointer",
                    getTagStyles(tag.color)
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTagClick(tag);
                  }}
                >
                  {tag.name}
                  <X 
                    className="h-3 w-3 ml-1 cursor-pointer opacity-50 hover:opacity-100" 
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveTag(note.id, tag.name);
                    }}
                  />
                </Badge>
              ))}
              {isEditingTags ? (
                <div className="relative" onClick={e => e.stopPropagation()}>
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleAddTag(tagInput);
                      } else if (e.key === 'Escape') {
                        setIsEditingTags(false);
                        setTagInput('');
                      }
                    }}
                    onBlur={() => {
                      if (tagInput.trim()) {
                        handleAddTag(tagInput);
                      }
                      setIsEditingTags(false);
                    }}
                    placeholder="Add tag"
                    className="h-5 w-16 text-xs px-1.5"
                    autoFocus
                  />
                </div>
              ) : (
                <ActionButton
                  icon={Plus}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsEditingTags(true);
                  }}
                  className="h-5 w-5 p-0 opacity-0 group-hover:opacity-100"
                />
              )}
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>{formattedDate}</span>
            </div>
            <ActionButton
              icon={isExpanded ? ChevronUp : ChevronDown}
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-5 w-5 p-0 opacity-0 group-hover:opacity-100"
            />
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <ActionButton
            icon={Download}
            onClick={handleDownload}
            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
          />
          {onEdit && (
            <ActionButton
              icon={Edit2}
              onClick={() => onEdit(note)}
              className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
            />
          )}
          <ActionButton
            icon={Trash2}
            onClick={() => onDelete(note.id)}
            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
          />
        </div>
      </div>
    </div>
  );
};