import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MovieCard from "@/components/MovieCard";
import EmptyState from "@/components/EmptyState";
import { List, CheckCircle } from "lucide-react";
import { useLocation } from "wouter";

//todo: remove mock functionality
const mockWantToWatch = [
  { id: 3, title: "Inception", posterPath: "https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg", rating: 8.8, year: "2010", status: "want_to_watch" },
  { id: 4, title: "Interstellar", posterPath: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg", rating: 8.6, year: "2014", status: "want_to_watch" },
  { id: 5, title: "The Matrix", posterPath: "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg", rating: 8.7, year: "1999", status: "want_to_watch" },
];

//todo: remove mock functionality
const mockWatched = [
  { id: 2, title: "The Dark Knight", posterPath: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg", rating: 9.0, year: "2008", status: "watched", userRating: 9 },
  { id: 1, title: "The Shawshank Redemption", posterPath: "https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg", rating: 8.7, year: "1994", status: "watched", userRating: 10 },
  { id: 7, title: "Pulp Fiction", posterPath: "https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg", rating: 8.9, year: "1994", status: "watched", userRating: 8 },
];

export default function WatchlistPage() {
  const [, setLocation] = useLocation();
  const [wantToWatch, setWantToWatch] = useState(mockWantToWatch);
  const [watched, setWatched] = useState(mockWatched);

  const handleMovieClick = (movieId) => {
    setLocation(`/movie/${movieId}`);
  };

  const handleRemoveFromWatchlist = (movieId, status) => {
    if (status === "want_to_watch") {
      setWantToWatch(wantToWatch.filter((m) => m.id !== movieId));
    } else {
      setWatched(watched.filter((m) => m.id !== movieId));
    }
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-display font-bold mb-8">My Watchlist</h1>

        <Tabs defaultValue="want-to-watch" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
            <TabsTrigger value="want-to-watch">
              <List className="h-4 w-4 mr-2" />
              Want to Watch ({wantToWatch.length})
            </TabsTrigger>
            <TabsTrigger value="watched">
              <CheckCircle className="h-4 w-4 mr-2" />
              Watched ({watched.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="want-to-watch">
            {wantToWatch.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {wantToWatch.map((movie) => (
                  <MovieCard
                    key={movie.id}
                    {...movie}
                    isInWatchlist={true}
                    onClick={() => handleMovieClick(movie.id)}
                    onRemoveFromWatchlist={() => handleRemoveFromWatchlist(movie.id, "want_to_watch")}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={List}
                title="No movies in your watchlist"
                description="Start adding movies you want to watch to keep track of them here."
                actionLabel="Browse Movies"
                onAction={() => setLocation("/search")}
              />
            )}
          </TabsContent>

          <TabsContent value="watched">
            {watched.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {watched.map((movie) => (
                  <MovieCard
                    key={movie.id}
                    {...movie}
                    isInWatchlist={true}
                    onClick={() => handleMovieClick(movie.id)}
                    onRemoveFromWatchlist={() => handleRemoveFromWatchlist(movie.id, "watched")}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={CheckCircle}
                title="No watched movies yet"
                description="Mark movies as watched to keep track of what you've seen and rate them."
                actionLabel="Browse Movies"
                onAction={() => setLocation("/search")}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}