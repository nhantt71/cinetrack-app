import { useState } from "react";
import MovieCard from "@/components/MovieCard";
import EmptyState from "@/components/EmptyState";
import { Heart } from "lucide-react";
import { useLocation } from "wouter";

// todo: replace with real data source
const mockFavorites = [
  { id: 11, title: "Avengers: Endgame", posterPath: "https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg", rating: 8.4, year: "2019" },
  { id: 12, title: "Jurassic Park", posterPath: "https://image.tmdb.org/t/p/w500/b1xCNnyrPebIc7EWNZIa6jhb1Ww.jpg", rating: 8.2, year: "1993" },
  { id: 13, title: "The Godfather", posterPath: "https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg", rating: 9.2, year: "1972" },
];

export default function FavoritesPage() {
  const [, setLocation] = useLocation();
  const [favorites, setFavorites] = useState(mockFavorites);

  const handleMovieClick = (movieId) => {
    setLocation(`/movie/${movieId}`);
  };

  const handleRemoveFavorite = (movieId) => {
    setFavorites(favorites.filter((m) => m.id !== movieId));
  };

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


