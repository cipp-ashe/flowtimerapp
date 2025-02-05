import * as React from "react"
import { Dialog as BaseDialog, DialogContent, DialogOverlay, DialogPortal } from "../ui/dialog"
import { cn } from "@/lib/utils"

const TimerCompletionDialog = BaseDialog

const TimerCompletionDialogContent = React.forwardRef<
  React.ElementRef<typeof DialogContent>,
  React.ComponentPropsWithoutRef<typeof DialogContent>
>(({ className, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay className="z-[150] bg-black/60" />
    <DialogContent
      ref={ref}
      className={cn(
        "z-[150]",
        className
      )}
      {...props}
    />
  </DialogPortal>
))
TimerCompletionDialogContent.displayName = "TimerCompletionDialogContent"

export { TimerCompletionDialog, TimerCompletionDialogContent }