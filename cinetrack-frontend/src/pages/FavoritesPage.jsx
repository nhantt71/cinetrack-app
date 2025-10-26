import { useState, useEffect } from "react";
import MovieCard from "@/components/MovieCard";
import EmptyState from "@/components/EmptyState";
import { Heart } from "lucide-react";
import { useLocation } from "wouter";
import { endpoints } from "@/services/backendApi";
import { AuthService } from "@/services/AuthService";

export default function FavoritesPage() {
  const [, setLocation] = useLocation();
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFavorites = async (userId) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const token = AuthService.getToken();
      if (!token) {
        setError("Not authenticated");
        return;
      }

      const response = await fetch(endpoints.getFavorites(userId), {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const favoritesData = await response.json();
        console.log(favoritesData);
        
        // Fetch movie details for each favorite
        const fetchMovieDetails = async (movieId) => {
          try {
            const response = await fetch(endpoints.getMovieDetails(movieId), {
              headers: {
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
        
        // Fetch details for all favorite movies
        const favoriteMovies = await Promise.all(
          favoritesData.map(async (item) => {
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
                addedAt: item.AddedAt
              };
            }
            return null;
          })
        ).then(movies => movies.filter(movie => movie !== null));
        
        setFavorites(favoriteMovies);
      } else {
        setError("Failed to fetch favorites");
      }
    } catch (err) {
      setError("Network error. Please try again.");
      console.error("Favorites fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Get UserID from URL or from authenticated user
    const pathParts = window.location.pathname.split('/');
    const userIdFromUrl = pathParts[pathParts.length - 1];
    
    if (userIdFromUrl && userIdFromUrl !== 'favorites') {
      fetchFavorites(userIdFromUrl);
    } else {
      // Fallback: get user ID from auth service
      const user = AuthService.getCurrentUser();
      if (user && user.UserID) {
        fetchFavorites(user.UserID);
      } else {
        setError("User not found");
        setIsLoading(false);
      }
    }
  }, []);

  const handleMovieClick = (movieId) => {
    setLocation(`/movie/${movieId}`);
  };

  const handleRemoveFavorite = async (movieId) => {
    try {
      const user = AuthService.getCurrentUser();
      if (!user || !user.UserID) {
        setError("User not found");
        return;
      }

      const token = AuthService.getToken();
      if (!token) {
        setError("Not authenticated");
        return;
      }

      const response = await fetch(endpoints.removeFromFavorites(user.UserID, movieId), {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        // Update local state
        setFavorites(favorites.filter((m) => m.id !== movieId));
        console.log(`Movie ${movieId} removed from favorites`);
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to remove from favorites");
      }
    } catch (err) {
      setError("Network error. Please try again.");
      console.error("Remove from favorites error:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 py-8">
          <h1 className="text-4xl font-display font-bold mb-8 flex items-center gap-3">
            <Heart className="h-7 w-7 text-primary" /> Favorites
          </h1>
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading your favorites...</p>
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
          <h1 className="text-4xl font-display font-bold mb-8 flex items-center gap-3">
            <Heart className="h-7 w-7 text-primary" /> Favorites
          </h1>
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
        <h1 className="text-4xl font-display font-bold mb-8 flex items-center gap-3">
          <Heart className="h-7 w-7 text-primary" /> Favorites
        </h1>

        {favorites.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {favorites.map((movie) => (
              <MovieCard
                key={movie.id}
                {...movie}
                isInWatchlist={true}
                onClick={() => handleMovieClick(movie.id)}
                onRemoveFromWatchlist={() => handleRemoveFavorite(movie.id)}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Heart}
            title="No favorites yet"
            description="Save your favorite movies to find them quickly here."
            actionLabel="Browse Movies"
            onAction={() => setLocation("/search")}
          />
        )}
      </div>
    </div>
  );
}


