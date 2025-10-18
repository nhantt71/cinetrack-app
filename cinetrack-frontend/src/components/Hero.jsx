import { Play, Plus, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Hero({
  title, overview, backdropPath, rating, year, runtime, genres = [],
  onPlayClick, onAddToWatchlist
}) {
  return (
    <div className="relative min-h-[70vh] w-full overflow-hidden">
      {backdropPath ? (
        <img src={backdropPath} alt={title} className="absolute inset-0 h-full w-full object-cover" />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-accent/20" />
      )}

      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />

      <div className="container relative mx-auto flex min-h-[70vh] items-end px-4 md:px-6 lg:px-8 pb-16 md:pb-20">
        <div className="max-w-2xl space-y-6">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight text-white drop-shadow-lg">
              {title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-3 text-sm md:text-base">
              {rating && (
                <div className="flex items-center gap-1 text-white">
                  <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                  <span className="font-semibold">{rating.toFixed(1)}</span>
                </div>
              )}
              {year && <span className="text-white/90">{year}</span>}
              {runtime && <span className="text-white/90">{runtime} min</span>}
            </div>

            {genres.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {genres.map((genre) => (
                  <Badge key={genre} variant="secondary" className="bg-white/10 backdrop-blur-sm text-white border-white/20">
                    {genre}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <p className="text-base md:text-lg text-white/90 line-clamp-3 drop-shadow-md max-w-xl">
            {overview}
          </p>

          <div className="flex flex-wrap gap-3">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-white font-semibold"
              onClick={() => { onPlayClick?.(); console.log(`Play ${title}`); }}>
              <Play className="mr-2 h-5 w-5 fill-current" />
              More Info
            </Button>
            <Button size="lg" variant="outline"
              className="bg-white/20 backdrop-blur-md border-white/30 text-white hover:bg-white/30"
              onClick={() => { onAddToWatchlist?.(); console.log(`Added ${title} to watchlist`); }}>
              <Plus className="mr-2 h-5 w-5" />
              Add to Watchlist
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}