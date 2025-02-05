import { useState, useEffect, useCallback } from "react";
import { Quote } from "../types/timer";
import { toast } from "sonner";

type QuoteCategory = 
  | 'focus'
  | 'creativity'
  | 'learning'
  | 'persistence'
  | 'motivation'
  | 'growth';
import { quotes } from "../data/quotes";

interface UseQuoteManagerProps {
  favorites: Quote[];
  setFavorites: React.Dispatch<React.SetStateAction<Quote[]>>;
  currentTask?: string;
}

interface UseQuoteManagerReturn {
  currentQuote: Quote | null;
  isLiked: boolean;
  isFlipped: boolean;
  handleLike: () => void;
  getRandomQuote: () => void;
}

export const useQuoteManager = ({
  favorites,
  setFavorites,
  currentTask,
}: UseQuoteManagerProps): UseQuoteManagerReturn => {
  const [currentQuote, setCurrentQuote] = useState<Quote | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [quotePool, setQuotePool] = useState<Quote[]>([...quotes]);

  const getRelevantCategories = useCallback((taskName: string = ''): QuoteCategory[] => {
    const taskLower = taskName.toLowerCase();
    const categories: QuoteCategory[] = [];

    const categoryKeywords = {
      focus: ['focus', 'concentrate', 'study', 'work', 'read'],
      creativity: ['create', 'design', 'write', 'art', 'brainstorm'],
      learning: ['learn', 'study', 'research', 'understand', 'explore','education'],
      persistence: ['finish', 'complete', 'continue', 'keep', 'remain'],
      motivation: ['start', 'begin', 'initiate', 'launch', 'plan'],
      growth: ['improve', 'develop', 'grow', 'progress', 'advance']
    };

    Object.entries(categoryKeywords).forEach(([category, keywords]) => {
      if (keywords.some(keyword => taskLower.includes(keyword))) {
        categories.push(category as QuoteCategory);
      }
    });

    if (categories.length === 0) {
      categories.push('motivation', 'focus');
    }

    return categories;
  }, []);

  const getContextualQuotes = useCallback((allQuotes: Quote[], taskCategories: QuoteCategory[]): Quote[] => {
    let matchingQuotes = allQuotes.filter(quote => 
      quote.categories.some(category => taskCategories.includes(category))
    );

    if (matchingQuotes.length === 0) {
      matchingQuotes = allQuotes;
    }

    return matchingQuotes;
  }, []);

  const shuffleQuotes = useCallback((quotesToShuffle: Quote[]) => {
    return [...quotesToShuffle].sort(() => Math.random() - 0.5);
  }, []);

  const TRANSITION_DURATION = 2000;

  const getRandomQuote = useCallback(() => {
    if (isTransitioning) return;

    const taskCategories = getRelevantCategories(currentTask);
    const contextualQuotes = getContextualQuotes(quotes, taskCategories);

    if (quotePool.length === 0) {
      const shuffled = shuffleQuotes(contextualQuotes);
      setQuotePool(shuffled);
      return;
    }

    const newQuote = quotePool[0];
    setQuotePool(prev => prev.slice(1));
    setIsFlipped(true);
    setIsTransitioning(true);

    setTimeout(() => {
      setCurrentQuote(newQuote);
      setIsLiked(favorites.some(fav => fav.text === newQuote.text));
      setIsFlipped(false);
      setIsTransitioning(false);
    }, TRANSITION_DURATION);
  }, [currentTask, favorites, isTransitioning, getRelevantCategories, getContextualQuotes, shuffleQuotes, quotePool]);

  const handleLike = useCallback(() => {
    if (!currentQuote) return;

    if (!isLiked) {
      const favoriteQuote = {
        ...currentQuote,
        timestamp: new Date().toLocaleString(),
        task: currentTask
      };
      setFavorites(prev => [...prev, favoriteQuote]);
      toast.success("Quote favorited ❤️", {
        description: "Added to your favorites ✨"
      });
    } else {
      setFavorites(prev => prev.filter(quote => quote.text !== currentQuote.text));
      toast.success("Quote removed 💔", {
        description: "Removed from favorites"
      });
    }
    setIsLiked(!isLiked);
  }, [currentQuote, currentTask, isLiked, setFavorites]);

  // Initialize quotes
  useEffect(() => {
    if (!currentQuote) {
      const taskCategories = getRelevantCategories(currentTask);
      const contextualQuotes = getContextualQuotes(quotes, taskCategories);
      const shuffledQuotes = shuffleQuotes(contextualQuotes);
      setQuotePool(shuffledQuotes.slice(1));
      setCurrentQuote(shuffledQuotes[0]);
    }
  }, [currentTask, currentQuote, getRelevantCategories, getContextualQuotes, shuffleQuotes]);

  // Auto-cycle quotes
  useEffect(() => {
    const cycleQuote = () => {
      if (!isTransitioning && quotePool.length > 0) {
        getRandomQuote();
      }
    };

    const interval = setInterval(cycleQuote, 15000);
    return () => clearInterval(interval);
  }, [isTransitioning, quotePool.length, getRandomQuote]);

  // Update like status when quote or favorites change
  useEffect(() => {
    if (currentQuote) {
      setIsLiked(favorites.some(fav => fav.text === currentQuote.text));
    }
  }, [currentQuote, favorites]);

  return {
    currentQuote,
    isLiked,
    isFlipped,
    handleLike,
    getRandomQuote,
  };
};
