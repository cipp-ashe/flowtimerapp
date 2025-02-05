import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { toast } from "sonner";
import { z } from "zod";

interface EmailSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (email: string, clearData?: boolean) => Promise<void>;
  type?: 'tasks' | 'notes';
}

const emailSchema = z.string().email("Please enter a valid email address");

export const EmailSummaryModal = ({
  isOpen,
  onClose,
  onSubmit,
  type = 'tasks'
}: EmailSummaryModalProps) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [clearAfterSend, setClearAfterSend] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      emailSchema.parse(email);
      setIsLoading(true);
      
      await onSubmit(email, clearAfterSend);
      toast.success("Summary email sent successfully! 📧✨");
      onClose();
      setEmail("");
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(`${error.errors[0].message} ⚠️`);
      } else {
        toast.error(error instanceof Error ? `${error.message} ⚠️` : 'Failed to send email ❌');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="space-y-3">
          <DialogTitle>Send {type === 'notes' ? 'Notes' : 'Daily'} Summary</DialogTitle>
          <DialogDescription>
            Enter your email address to receive a summary of your {type === 'notes' ? 'notes' : "day's tasks, metrics, and favorite quotes"}.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="mt-4 space-y-6">
          <div className="space-y-2">
            <Input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              className="w-full [-webkit-text-fill-color:hsl(var(--foreground))] [&:-webkit-autofill]:[-webkit-text-fill-color:hsl(var(--foreground))] [&:-webkit-autofill]:shadow-[0_0_0px_1000px_hsl(var(--muted))_inset] dark:[&:-webkit-autofill]:shadow-[0_0_0px_1000px_hsl(var(--muted))_inset]"
            />
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="clearAfterSend"
              checked={clearAfterSend}
              onChange={(e) => setClearAfterSend(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <label 
              htmlFor="clearAfterSend"
              className="text-sm text-muted-foreground"
            >
              Clear {type === 'notes' ? 'notes' : 'tasks'} after sending
            </label>
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Sending..." : "Send Summary"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
