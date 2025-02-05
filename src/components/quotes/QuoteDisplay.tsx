import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Heart, RefreshCw, Sparkles } from "lucide-react";
import { Quote } from "@/types/timer";
import { useQuoteManager } from "@/hooks/useQuoteManager";

interface QuoteDisplayProps {
  favorites: Quote[];
  setFavorites: React.Dispatch<React.SetStateAction<Quote[]>>;
  onLike?: () => void;
  currentTask?: string;
  showAsOverlay?: boolean;
}

export const QuoteDisplay = ({
  favorites,
  setFavorites,
  onLike,
  currentTask}: QuoteDisplayProps) => {
  const {
    currentQuote,
    nextQuote,
    isLiked,
    isFading,
    handleLike,
    getRandomQuote,
  } = useQuoteManager({
    favorites,
    setFavorites,
    currentTask,
  });

  if (!currentQuote) {
    return null;
  }

  return (
    <div className="w-full">
      <Card className="quote-card p-3 bg-card/80 backdrop-blur-sm border-primary/20 shadow-lg">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              handleLike();
              if (!isLiked) onLike?.();
            }}
            className={`transition-all duration-300 hover:scale-105 hover:bg-transparent ${
              isLiked ? 'text-red-500 hover:text-red-600' : 'text-muted-foreground hover:text-primary'
            }`}
          >
            <Heart className="h-4 w-4" fill={isLiked ? "currentColor" : "none"} />
          </Button>

          <div className="flex-1 text-center mx-4">
            <p className="text-lg font-medium italic bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500 mb-1">
              "{currentQuote.text}"
            </p>
            <span className="text-sm text-muted-foreground">— {currentQuote.author}</span>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={getRandomQuote}
            className="text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-105 hover:bg-transparent"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
};

export { FavoriteQuotes } from './FavoriteQuotes';
