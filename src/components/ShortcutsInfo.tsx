import { memo } from "react";
import { Keyboard } from "lucide-react";
import { Button } from "./ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface Shortcut {
  key: string;
  action: string;
}

interface ShortcutsInfoProps {
  shortcuts: Shortcut[];
}

export const ShortcutsInfo = memo(({ shortcuts }: ShortcutsInfoProps) => (
  <TooltipProvider>
    <Tooltip delayDuration={0}>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="absolute bottom-2 right-2 text-muted-foreground hover:text-foreground"
        >
          <Keyboard className="h-4 w-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent align="end" className="bg-card">
        <div className="space-y-2">
          <p className="text-sm font-semibold">Keyboard Shortcuts</p>
          <div className="space-y-1">
            {shortcuts.map(({ key, action }) => (
              <div key={key} className="flex items-center text-sm">
                <kbd className="px-2 py-0.5 bg-muted rounded text-xs font-mono">
                  {key}
                </kbd>
                <span className="ml-2 text-muted-foreground">{action}</span>
              </div>
            ))}
          </div>
        </div>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
));

ShortcutsInfo.displayName = 'ShortcutsInfo';