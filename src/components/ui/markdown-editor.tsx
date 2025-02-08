import React from 'react';
import MDEditor from '@uiw/react-md-editor';
import { cn } from '@/lib/utils';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string | undefined) => void;
  onBlur?: () => void;
  className?: string;
  height?: string | number;
  preview?: 'edit' | 'live' | 'preview';
}

export const MarkdownEditor = ({
  value,
  onChange,
  onBlur,
  className,
  height = '100%',
  preview = 'edit'
}: MarkdownEditorProps) => {
  return (
    <div
      className={cn(
        'markdown-editor [&_.w-md-editor]:!bg-background/50 [&_.w-md-editor]:!border-primary/10',
        '[&_.w-md-editor-toolbar]:!bg-background/50 [&_.w-md-editor-toolbar]:!border-primary/10',
        '[&_.w-md-editor-toolbar>ul>li>button]:!text-muted-foreground [&_.w-md-editor-toolbar>ul>li>button:hover]:!text-primary',
        '[&_.w-md-editor-text]:!bg-transparent [&_.w-md-editor-text]:!text-foreground',
        '[&_.w-md-editor-text-pre>code]:!bg-transparent',
        '[&_.w-md-editor-text-pre]:!bg-transparent',
        '[&_.w-md-editor-text-input]:!bg-transparent',
        '[&_.wmde-markdown-color]:!text-foreground [&_.wmde-markdown-color>*]:!text-foreground',
        '[&_.w-md-editor-preview]:!bg-background/50',
        '[&_.w-md-editor-preview]:!text-foreground',
        '[&_.w-md-editor-preview>div]:!text-foreground',
        '[&_pre]:!bg-muted/50',
        '[&_code]:!text-primary',
        '[&_blockquote]:!border-l-primary/20 [&_blockquote]:!text-muted-foreground',
        '[&_hr]:!border-primary/10',
        '[&_a]:!text-primary',
        '[&_table]:!border-primary/10 [&_td]:!border-primary/10 [&_th]:!border-primary/10',
        className
      )}
      data-color-mode="dark"
    >
      <MDEditor
        value={value}
        onChange={onChange}
        preview={preview}
        height={height}
        hideToolbar={false}
        visibleDragbar={false}
        textareaProps={{
          placeholder: 'Write your note here...',
          onBlur: onBlur
        }}
      />
    </div>
  );
};