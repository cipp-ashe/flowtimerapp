import React, { useCallback, useEffect, useRef } from 'react';
import { marked } from 'marked';
import { toast } from 'sonner';
import MDEditor from '@uiw/react-md-editor';
import { Button } from '@/components/ui/button';
import { Code, Copy } from 'lucide-react';

interface NotesTabsViewProps {
  content: string;
  onChange: (value: string) => void;
  onSave: () => void;
  isEditing: boolean;
}

export const NotesTabsView = ({ content, onChange, onSave, isEditing }: NotesTabsViewProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleCopyMarkdown = async () => {
    try {
      await navigator.clipboard.writeText(content);
      toast.success("Raw markdown copied to clipboard 📋");
    } catch (error) {
      console.error('Error copying markdown:', error);
      toast.error("Failed to copy markdown ❌");
    }
  };

  const handleCopyFormatted = async () => {
    try {
      // Create a temporary div to render the markdown
      const tempDiv = document.createElement('div');
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      document.body.appendChild(tempDiv);

      // Render markdown to HTML
      tempDiv.innerHTML = marked.parse(content);

      // Copy the formatted content
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(tempDiv);
      selection?.removeAllRanges();
      selection?.addRange(range);
      document.execCommand('copy');
      selection?.removeAllRanges();
      document.body.removeChild(tempDiv);
      toast.success("Formatted content copied to clipboard ✨");
    } catch (error) {
      console.error('Error copying formatted content:', error);
      toast.error("Failed to copy formatted content ❌");
    }
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        if (content.trim()) {
          onSave();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [content, onSave]);

  // Handle auto-save on page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (content.trim()) {
        onSave();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [content, onSave]);

  return (
    <div className="flex flex-col h-full" data-color-mode="dark" ref={containerRef}>
      <div className="flex items-center gap-2 px-2 py-1.5 border-b border-border/30">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopyMarkdown}
          className="flex items-center gap-1.5 text-xs hover:bg-primary/10 hover:text-primary transition-colors h-7"
        >
          <Code className="w-3.5 h-3.5" />
          Copy Raw
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopyFormatted}
          className="flex items-center gap-1.5 text-xs hover:bg-primary/10 hover:text-primary transition-colors h-7"
        >
          <Copy className="w-3.5 h-3.5" />
          Copy Formatted
        </Button>
        <div className="flex-1" />
        {content && (
          <Button 
            onClick={onSave} 
            size="sm" 
            className="h-7 px-3 bg-primary hover:bg-primary/90 shadow-sm hover:shadow transition-all hover:scale-[1.02] text-xs"
          >
            {isEditing ? "Update" : "Save"}
          </Button>
        )}
      </div>
      <div className="flex-1 min-h-0 flex flex-col">
        <div className="flex-1 h-full [&_.w-md-editor]:!h-full [&_.w-md-editor-content]:!h-full [&_.w-md-editor]:!bg-transparent/30 [&_.w-md-editor-content]:!bg-transparent [&_.w-md-editor-input]:!bg-transparent [&_.w-md-editor-preview]:!bg-transparent [&_.w-md-editor-toolbar]:!bg-background/50 [&_.w-md-editor-toolbar]:backdrop-blur-sm [&_.w-md-editor-text]:!text-foreground [&_.w-md-editor-preview]:!text-foreground [&_.w-md-editor-text-pre]:!text-foreground [&_.w-md-editor-text-input]:!text-foreground [&_.w-md-editor-text-pre>code]:!text-foreground [&_.w-md-editor-text-pre>pre]:!text-foreground [&_.w-md-editor-preview]:!text-foreground [&_.w-md-editor-toolbar-divider]:!border-border/30 [&_.w-md-editor]:!border-none [&_.w-md-editor-toolbar]:!border-none [&_.w-md-editor-toolbar]:!shadow-none [&_.w-md-editor-toolbar]:!rounded-none [&_.w-md-editor-toolbar]:!px-2 [&_.w-md-editor-toolbar]:!py-1.5 [&_.w-md-editor-toolbar>button]:!text-foreground/80 [&_.w-md-editor-toolbar>button:hover]:!text-foreground [&_.w-md-editor-toolbar>button]:!bg-transparent [&_.w-md-editor-toolbar>button:hover]:!bg-primary/10 [&_.w-md-editor-toolbar>button]:!transition-colors [&_.w-md-editor-toolbar>button]:!h-7 [&_.w-md-editor-toolbar>button]:!w-7 [&_.w-md-editor-toolbar>button]:!p-0 [&_.w-md-editor-toolbar>button]:!rounded-md [&_.w-md-editor-toolbar-divider]:!mx-1 [&_.w-md-editor-toolbar-divider]:!h-4 [&_.w-md-editor-text-pre>code>span]:!text-foreground/80 [&_.w-md-editor-text-pre>code>span.token.punctuation]:!text-foreground/60 [&_.w-md-editor-text-pre>code>span.token.keyword]:!text-primary [&_.w-md-editor-text-pre>code>span.token.string]:!text-green-500 [&_.w-md-editor-text-pre>code>span.token.function]:!text-yellow-500 [&_.w-md-editor-preview>*]:!text-foreground [&_.w-md-editor-preview>h1]:!text-2xl [&_.w-md-editor-preview>h2]:!text-xl [&_.w-md-editor-preview>h3]:!text-lg [&_.w-md-editor-preview>h4]:!text-base [&_.w-md-editor-preview>h5]:!text-sm [&_.w-md-editor-preview>h6]:!text-xs [&_.w-md-editor-preview>p]:!text-base [&_.w-md-editor-preview>ul]:!text-base [&_.w-md-editor-preview>ol]:!text-base [&_.w-md-editor-preview>blockquote]:!text-base [&_.w-md-editor-preview>pre]:!text-sm [&_.w-md-editor-preview>code]:!text-sm [&_.w-md-editor-preview>a]:!text-primary [&_.w-md-editor-preview>a:hover]:!text-primary/80 [&_.w-md-editor-preview>*]:!mb-4 [&_.w-md-editor-preview>*:last-child]:!mb-0 [&_.w-md-editor-preview>blockquote]:!border-l-2 [&_.w-md-editor-preview>blockquote]:!border-primary/30 [&_.w-md-editor-preview>blockquote]:!pl-4 [&_.w-md-editor-preview>blockquote]:!italic [&_.w-md-editor-preview>blockquote]:!text-foreground/80 [&_.w-md-editor-preview>pre]:!bg-background/50 [&_.w-md-editor-preview>pre]:!p-4 [&_.w-md-editor-preview>pre]:!rounded-lg [&_.w-md-editor-preview>pre]:!border [&_.w-md-editor-preview>pre]:!border-border/30 [&_.w-md-editor-preview>ul]:!pl-6 [&_.w-md-editor-preview>ol]:!pl-6 [&_.w-md-editor-preview>ul>li]:!mb-2 [&_.w-md-editor-preview>ol>li]:!mb-2 [&_.w-md-editor-preview>ul>li:last-child]:!mb-0 [&_.w-md-editor-preview>ol>li:last-child]:!mb-0 [&_.w-md-editor-preview>p>code]:!bg-background/50 [&_.w-md-editor-preview>p>code]:!px-1.5 [&_.w-md-editor-preview>p>code]:!py-0.5 [&_.w-md-editor-preview>p>code]:!rounded-md [&_.w-md-editor-preview>p>code]:!border [&_.w-md-editor-preview>p>code]:!border-border/30 [&_.w-md-editor-preview>table]:!w-full [&_.w-md-editor-preview>table]:!border-collapse [&_.w-md-editor-preview>table>thead>tr>th]:!border [&_.w-md-editor-preview>table>thead>tr>th]:!border-border/30 [&_.w-md-editor-preview>table>thead>tr>th]:!bg-background/50 [&_.w-md-editor-preview>table>thead>tr>th]:!p-2 [&_.w-md-editor-preview>table>tbody>tr>td]:!border [&_.w-md-editor-preview>table>tbody>tr>td]:!border-border/30 [&_.w-md-editor-preview>table>tbody>tr>td]:!p-2">
          <MDEditor
            value={content}
            onChange={value => onChange(value || '')}
            className="h-full"
            visibleDragbar={false}
            preview="edit"
            textareaProps={{
              placeholder: "Type your note here...",
              className: "h-full overflow-x-hidden px-4 py-3 focus:outline-none text-base placeholder:text-muted-foreground/50",
            }}
            previewOptions={{
              className: "prose prose-sm dark:prose-invert"
            }}
          />
        </div>
      </div>
    </div>
  );
};
