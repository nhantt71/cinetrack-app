import { Star, Plus, Check, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

export default function MovieCard({
  id,
  title,
  posterPath,
  rating,
  year,
  isInWatchlist = false,
  status,
  userRating,
  onAddToWatchlist,
  onRemoveFromWatchlist,
  onClick,
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [inWatchlist, setInWatchlist] = useState(isInWatchlist);

  const handleWatchlistToggle = (e) => {
    e.stopPropagation();
    if (inWatchlist) {
      setInWatchlist(false);
      onRemoveFromWatchlist?.();
      console.log(`Removed "${title}" from watchlist`);
    } else {
      setInWatchlist(true);
      onAddToWatchlist?.();
      console.log(`Added "${title}" to watchlist`);
    }
  };

  const handleClick = () => {
    onClick?.();
    console.log(`Clicked movie: ${title}`);
  };

  return (
    <div
      className="group relative cursor-pointer overflow-hidden rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      data-testid={`card-movie-${id}`}
    >
      <div className="aspect-[2/3] bg-muted relative">
        {posterPath ? (
          <img
            src={posterPath}
            alt={title}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-muted to-accent">
            <span className="text-4xl font-display font-bold text-muted-foreground opacity-30">
              {title.charAt(0)}
            </span>
          </div>
        )}

        {status && (
          <Badge
            variant={status === "watched" ? "default" : "secondary"}
            className="absolute top-2 left-2 bg-background/90 backdrop-blur-sm"
          >
            {status === "watched" ? "Watched" : "Want to Watch"}
          </Badge>
        )}

        <div
          className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent transition-opacity duration-300 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="absolute bottom-0 left-0 right-0 p-4 space-y-3">
            <div>
              <h3 className="font-semibold text-white line-clamp-2 mb-1">
                {title}
              </h3>
              <div className="flex items-center gap-3 text-sm text-white/80">
                {year && <span>{year}</span>}
                {rating && (
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                    <span>{rating.toFixed(1)}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                className="flex-1 bg-primary hover:bg-primary/90"
                onClick={(e) => {
                  e.stopPropagation();
                  console.log(`Play ${title}`);
                }}
                data-testid={`button-play-${id}`}
              >
                <Play className="h-4 w-4 mr-1 fill-current" />
                Details
              </Button>
              <Button
                size="icon"
                variant={inWatchlist ? "secondary" : "outline"}
                className="h-8 w-8 bg-background/20 backdrop-blur-sm border-white/20"
                onClick={handleWatchlistToggle}
                data-testid={`button-watchlist-${id}`}
              >
                {inWatchlist ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
              </Button>
            </div>

            {userRating && (
              <div className="flex items-center gap-1 text-yellow-500">
                <Star className="h-3 w-3 fill-current" />
                <span className="text-xs text-white">
                  Your rating: {userRating}/10
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}