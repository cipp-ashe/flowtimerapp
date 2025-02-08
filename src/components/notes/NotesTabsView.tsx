import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Save } from 'lucide-react';

interface NotesTabsViewProps {
  content: string;
  onChange: (content: string) => void;
  onSave: () => void;
  isEditing?: boolean;
}

export const NotesTabsView = ({
  content,
  onChange,
  onSave,
  isEditing
}: NotesTabsViewProps) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      onSave();
    }
  };

  return (
    <Tabs defaultValue="write" className="h-full">
      <div className="flex items-center justify-between px-4 py-2">
        <TabsList>
          <TabsTrigger value="write">Write</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>
        <Button
          variant="ghost"
          size="sm"
          onClick={onSave}
          className="text-muted-foreground hover:text-primary"
        >
          <Save className="h-4 w-4 mr-2" />
          {isEditing ? 'Update' : 'Save'}
        </Button>
      </div>

      <TabsContent value="write" className="h-[calc(100%-48px)] p-0">
        <Textarea
          value={content}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Write your note here..."
          className="h-full resize-none border-0 focus-visible:ring-0 rounded-none bg-transparent"
        />
      </TabsContent>

      <TabsContent value="preview" className="h-[calc(100%-48px)] p-4">
        <div className="prose prose-sm dark:prose-invert max-w-none">
          {content || <span className="text-muted-foreground">Nothing to preview</span>}
        </div>
      </TabsContent>
    </Tabs>
  );
};
