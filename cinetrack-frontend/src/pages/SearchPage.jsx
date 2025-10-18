import { useState } from "react";
import FilterBar from "@/components/FilterBar";
import MovieCard from "@/components/MovieCard";
import EmptyState from "@/components/EmptyState";
import { MovieGridSkeleton } from "@/components/LoadingSkeleton";
import { Film } from "lucide-react";
import { useLocation } from "wouter";

//todo: remove mock functionality
const mockMovies = [
  { id: 1, title: "The Shawshank Redemption", posterPath: "https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg", rating: 8.7, year: "1994" },
  { id: 2, title: "The Dark Knight", posterPath: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg", rating: 9.0, year: "2008" },
  { id: 3, title: "Inception", posterPath: "https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg", rating: 8.8, year: "2010" },
  { id: 4, title: "Interstellar", posterPath: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg", rating: 8.6, year: "2014" },
  { id: 5, title: "The Matrix", posterPath: "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg", rating: 8.7, year: "1999" },
  { id: 6, title: "Forrest Gump", posterPath: "https://image.tmdb.org/t/p/w500/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg", rating: 8.8, year: "1994" },
  { id: 7, title: "Pulp Fiction", posterPath: "https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg", rating: 8.9, year: "1994" },
  { id: 8, title: "The Godfather", posterPath: "https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg", rating: 9.2, year: "1972" },
  { id: 9, title: "Avatar", posterPath: "https://image.tmdb.org/t/p/w500/kyeqWdyUXW608qlYkRqosgbbJyK.jpg", rating: 7.6, year: "2009" },
  { id: 10, title: "Titanic", posterPath: "https://image.tmdb.org/t/p/w500/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg", rating: 7.9, year: "1997" },
  { id: 11, title: "Avengers: Endgame", posterPath: "https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg", rating: 8.4, year: "2019" },
  { id: 12, title: "Jurassic Park", posterPath: "https://image.tmdb.org/t/p/w500/b1xCNnyrPebIc7EWNZIa6jhb1Ww.jpg", rating: 8.2, year: "1993" },
];

export default function SearchPage() {
  const [, setLocation] = useLocation();
  const [isLoading] = useState(false);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [sortBy, setSortBy] = useState("popularity.desc");

  const handleMovieClick = (movieId) => {
    setLocation(`/movie/${movieId}`);
  };

  const handleGenreToggle = (genre) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  const handleClearFilters = () => {
    setSelectedGenres([]);
    setSortBy("popularity.desc");
  };

  return (
    <div className="min-h-screen">
      <FilterBar
        selectedGenres={selectedGenres}
        sortBy={sortBy}
        onGenreToggle={handleGenreToggle}
        onSortChange={setSortBy}
        onClearFilters={handleClearFilters}
      />

      {isLoading ? (
        <MovieGridSkeleton />
      ) : mockMovies.length > 0 ? (
        <div className="container mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 px-4 md:px-6 lg:px-8 py-6">
            {mockMovies.map((movie) => (
              <MovieCard key={movie.id} {...movie} onClick={() => handleMovieClick(movie.id)} />
            ))}
          </div>
        </div>
      ) : (
        <EmptyState
          icon={Film}
          title="No movies found"
          description="We couldn't find any movies matching your filters. Try adjusting your selection or browse all movies."
          actionLabel="Clear Filters"
          onAction={handleClearFilters}
        />
      )}
    </div>
  );
}