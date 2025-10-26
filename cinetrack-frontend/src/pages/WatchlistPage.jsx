import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MovieCard from "@/components/MovieCard";
import EmptyState from "@/components/EmptyState";
import { List, CheckCircle } from "lucide-react";
import { useLocation } from "wouter";
import { endpoints } from "@/services/backendApi";
import { AuthService } from "@/services/AuthService";


export default function WatchlistPage() {
  const [, setLocation] = useLocation();
  const [wantToWatch, setWantToWatch] = useState([]);
  const [watched, setWatched] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWatchlist = async (userId) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const token = AuthService.getToken();
      if (!token) {
        setError("Not authenticated");
        return;
      }

      const response = await fetch(endpoints.getWatchlist(userId), {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const watchlistData = await response.json();

        console.log(watchlistData);
        
        // Classify movies into want_to_watch and watched
        const wantToWatchItems = watchlistData.filter(item => item.Status === "want_to_watch");
        const watchedItems = watchlistData.filter(item => item.Status === "watched");
        
        // Fetch movie details for each item
        const fetchMovieDetails = async (movieId) => {
          try {
            const response = await fetch(endpoints.getMovieDetails(movieId), {
              headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            });
            if (response.ok) {
              return await response.json();
            }
          } catch (err) {
            console.error(`Failed to fetch details for movie ${movieId}:`, err);
          }
          return null;
        };
        
        // Fetch details for want to watch movies
        const wantToWatchMovies = await Promise.all(
          wantToWatchItems.map(async (item) => {
            const movieDetails = await fetchMovieDetails(item.MovieID);
            if (movieDetails && movieDetails.data) {
              const movie = movieDetails.data;
              return {
                id: movie.id,
                title: movie.title,
                posterPath: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null,
                rating: movie.vote_average,
                year: movie.release_date ? movie.release_date.split('-')[0] : null,
                overview: movie.overview,
                backdropPath: movie.backdrop_path ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}` : null,
                genres: movie.genres?.map(genre => genre.name) || [],
                runtime: movie.runtime,
                watchlistStatus: item.Status,
                addedAt: item.AddedAt
              };
            }
            return null;
          })
        ).then(movies => movies.filter(movie => movie !== null));
        
        // Fetch details for watched movies
        const watchedMovies = await Promise.all(
          watchedItems.map(async (item) => {
            const movieDetails = await fetchMovieDetails(item.MovieID);
            if (movieDetails && movieDetails.data) {
              const movie = movieDetails.data;
              return {
                id: movie.id,
                title: movie.title,
                posterPath: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null,
                rating: movie.vote_average,
                year: movie.release_date ? movie.release_date.split('-')[0] : null,
                overview: movie.overview,
                backdropPath: movie.backdrop_path ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}` : null,
                genres: movie.genres?.map(genre => genre.name) || [],
                runtime: movie.runtime,
                watchlistStatus: item.Status,
                addedAt: item.AddedAt
              };
            }
            return null;
          })
        ).then(movies => movies.filter(movie => movie !== null));
        
        setWantToWatch(wantToWatchMovies);
        setWatched(watchedMovies);
      } else {
        setError("Failed to fetch watchlist");
      }
    } catch (err) {
      setError("Network error. Please try again.");
      console.error("Watchlist fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Get UserID from URL or from authenticated user
    const pathParts = window.location.pathname.split('/');
    const userIdFromUrl = pathParts[pathParts.length - 1];
    
    if (userIdFromUrl && userIdFromUrl !== 'watchlist') {
      fetchWatchlist(userIdFromUrl);
    } else {
      // Fallback: get user ID from auth service
      const user = AuthService.getCurrentUser();
      if (user && user.UserID) {
        fetchWatchlist(user.UserID);
      } else {
        setError("User not found");
        setIsLoading(false);
      }
    }
  }, []);

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

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 py-8">
          <h1 className="text-4xl font-display font-bold mb-8">My Watchlist</h1>
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading your watchlist...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 py-8">
          <h1 className="text-4xl font-display font-bold mb-8">My Watchlist</h1>
          <div className="text-center py-12">
            <p className="text-destructive mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="text-primary hover:text-primary/80"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

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
                    onRemoveFromWatchlist={() => handleRemoveFromWatchlist(movie.id, movie.watchlistStatus)}
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
                    onRemoveFromWatchlist={() => handleRemoveFromWatchlist(movie.id, movie.watchlistStatus)}
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