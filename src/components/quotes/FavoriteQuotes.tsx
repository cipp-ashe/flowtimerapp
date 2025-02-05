import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Quote } from "@/types/timer/models";

interface FavoriteQuotesProps {
  favorites: Quote[];
  showAsOverlay?: boolean;
}

const QuoteCard = ({ quote }: { quote: Quote }) => (
  <Card className="p-4 bg-card/60 backdrop-blur-sm border-primary/20 transform transition-all duration-300 hover:scale-102 hover:shadow-[0_0_15px_rgba(168,85,247,0.4)] relative z-40">
    <div className="space-y-2">
      <p className="text-sm italic">{quote.text}</p>
      <div className="space-y-1">
        <p className="text-xs text-muted-foreground">— {quote.author}</p>
        {quote.task && (
          <p className="text-xs text-primary/70">
            Added during: {quote.task}
          </p>
        )}
        {quote.timestamp && (
          <p className="text-xs text-muted-foreground/70">
            {quote.timestamp}
          </p>
        )}
      </div>
    </div>
  </Card>
);

const Pagination = ({ currentPage, totalPages, onPrev, onNext }: {
  currentPage: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
}) => (
  <div className="flex justify-center gap-2 mt-4">
    <Button
      variant="outline"
      size="sm"
      onClick={onPrev}
      disabled={currentPage === 0}
      className="border-primary/20"
    >
      <ChevronLeft className="h-4 w-4" />
    </Button>
    <span className="text-sm text-muted-foreground py-2">
      {currentPage + 1} / {totalPages}
    </span>
    <Button
      variant="outline"
      size="sm"
      onClick={onNext}
      disabled={currentPage === totalPages - 1}
      className="border-primary/20"
    >
      <ChevronRight className="h-4 w-4" />
    </Button>
  </div>
);

export const FavoriteQuotes = ({ favorites, showAsOverlay = false }: FavoriteQuotesProps) => {
  const [currentPage, setCurrentPage] = useState(0);
  const quotesPerPage = 6;

  const totalPages = Math.ceil(favorites.length / quotesPerPage);
  const paginatedFavorites = favorites.slice(
    currentPage * quotesPerPage,
    (currentPage + 1) * quotesPerPage
  );

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 0));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages - 1));
  };

  if (favorites.length === 0 || showAsOverlay) return null;

  return (
    <div className="space-y-4 mt-8 max-w-5xl mx-auto opacity-100 transition-opacity duration-700">
      <h3 className="text-lg font-semibold text-primary">Favorite Quotes</h3>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        {paginatedFavorites.map((quote, index) => (
          <QuoteCard key={index} quote={quote} />
        ))}
      </div>
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPrev={handlePrevPage}
          onNext={handleNextPage}
        />
      )}
    </div>
  );
};