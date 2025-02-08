import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface NotesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  actionText: string;
  cancelText?: string;
  onAction: () => void;
  onCancel?: () => void;
  variant?: 'default' | 'destructive';
  inExpandedView?: boolean;
}

export const NotesDialog = ({
  open,
  onOpenChange,
  title,
  description,
  actionText,
  cancelText = "Cancel",
  onAction,
  onCancel,
  variant = 'default',
  inExpandedView = false
}: NotesDialogProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className={inExpandedView ? 'max-w-xl' : undefined}>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onAction}
            className={variant === 'destructive' ? 'bg-destructive hover:bg-destructive/90' : undefined}
          >
            {actionText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};