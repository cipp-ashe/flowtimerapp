import { memo } from "react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Loader2 } from "lucide-react";
import { SoundSelectorProps, SOUND_OPTIONS } from "../types/timer";

export const SoundSelector = memo(({
  selectedSound,
  onSoundChange,
  onTestSound,
  isLoadingAudio = false
}: SoundSelectorProps) => (
  <div className="space-y-2">
    <Label className="text-sm text-muted-foreground">Completion Sound</Label>
    <RadioGroup
      value={selectedSound}
      onValueChange={onSoundChange}
      className="flex flex-wrap justify-center gap-4"
    >
      {Object.keys(SOUND_OPTIONS).map((sound) => (
        <div key={sound} className="flex items-center space-x-2">
          <RadioGroupItem 
            value={sound} 
            id={sound}
            disabled={isLoadingAudio}
            aria-label={`Select ${sound} sound`}
          />
          <Label 
            htmlFor={sound} 
            className="capitalize"
          >
            {sound}
          </Label>
        </div>
      ))}
    </RadioGroup>
    <Button
      variant="outline"
      size="sm"
      onClick={onTestSound}
      className="mt-2 mx-auto block"
      disabled={isLoadingAudio || selectedSound === "none"}
      aria-label={`Test ${selectedSound} sound`}
    >
      {isLoadingAudio ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Playing...
        </>
      ) : (
        "Test Sound"
      )}
    </Button>
  </div>
));

SoundSelector.displayName = 'SoundSelector';