import { useState, useEffect } from "react";
import FilterBar from "@/components/FilterBar";
import MovieCard from "@/components/MovieCard";
import EmptyState from "@/components/EmptyState";
import { MovieGridSkeleton } from "@/components/LoadingSkeleton";
import { Film, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { endpoints } from "@/services/backendApi";
import { AuthService } from "@/services/AuthService";

const IMAGE_BASE_POSTER = "https://image.tmdb.org/t/p/w500";

export default function SearchPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [sortBy, setSortBy] = useState("popularity.desc");
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState(null);

  // Fetch genres on component mount
  useEffect(() => {
    fetchGenres();
  }, []);

  // Fetch movies when search query, selected genres, or sort changes
  useEffect(() => {
    if (searchQuery.trim()) {
      searchMovies();
    } else if (selectedGenres.length > 0) {
      searchByGenre();
    } else {
      // Load popular movies by default
      fetchPopularMovies();
    }
  }, [searchQuery, selectedGenres, sortBy]);

  const fetchGenres = async () => {
    try {
      const token = AuthService.getToken();
      const response = await fetch(endpoints.getGenres, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        const genreList = data.genres || data.data?.genres || [];
        setGenres(genreList);
      }
    } catch (error) {
      console.error("Error fetching genres:", error);
    }
  };

  const fetchPopularMovies = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const token = AuthService.getToken();
      const response = await fetch(endpoints.getPopularMovies, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        const movieList = data.results || data.data?.results || [];
        const mappedMovies = movieList.map((movie) => ({
          id: movie.id,
          title: movie.title,
          posterPath: movie.poster_path ? `${IMAGE_BASE_POSTER}${movie.poster_path}` : null,
          rating: movie.vote_average,
          year: movie.release_date ? movie.release_date.split('-')[0] : null,
          overview: movie.overview,
        }));
        setMovies(mappedMovies);
      } else {
        setError("Failed to fetch movies");
      }
    } catch (error) {
      setError("Network error. Please try again.");
      console.error("Error fetching popular movies:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const searchMovies = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`${endpoints.getMoviesBySearch}?query=${encodeURIComponent(searchQuery)}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        const movieList = data.data|| [];
        console.log(data.data);
        const mappedMovies = movieList.map((movie) => ({
          id: movie.id,
          title: movie.title,
          posterPath: movie.poster_path ? `${IMAGE_BASE_POSTER}${movie.poster_path}` : null,
          rating: movie.vote_average,
          year: movie.release_date ? movie.release_date.split('-')[0] : null,
          overview: movie.overview,
        }));
        setMovies(mappedMovies);
      } else {
        setError("Failed to search movies");
      }
    } catch (error) {
      setError("Network error. Please try again.");
      console.error("Error searching movies:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const searchByGenre = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Use only the first selected genre for genre search
      const genreName = selectedGenres[0];
      const response = await fetch(`${endpoints.getMoviesByGenreSearch}?genre=${genreName}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        const movieList = data.data.results || [];
        const mappedMovies = movieList.map((movie) => ({
          id: movie.id,
          title: movie.title,
          posterPath: movie.poster_path ? `${IMAGE_BASE_POSTER}${movie.poster_path}` : null,
          rating: movie.vote_average,
          year: movie.release_date ? movie.release_date.split('-')[0] : null,
          overview: movie.overview,
        }));
        setMovies(mappedMovies);
      } else {
        setError("Failed to search movies by genre");
      }
    } catch (error) {
      setError("Network error. Please try again.");
      console.error("Error searching movies by genre:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMovieClick = (movieId) => {
    navigate(`/movie/${movieId}`);
  };

  const handleGenreToggle = (genreName) => {
    // Allow only one genre selection - if clicking the same genre, deselect it
    setSelectedGenres((prev) =>
      prev.includes(genreName) ? [] : [genreName]
    );
  };

  const handleClearFilters = () => {
    setSelectedGenres([]);
    setSortBy("popularity.desc");
    setSearchQuery("");
  };

  return (
    <div className="min-h-screen">
      <FilterBar
        genres={genres}
        selectedGenres={selectedGenres}
        sortBy={sortBy}
        searchQuery={searchQuery}
        onGenreToggle={handleGenreToggle}
        onSortChange={setSortBy}
        onSearchChange={setSearchQuery}
        onClearFilters={handleClearFilters}
      />

      {error ? (
        <div className="container mx-auto px-4 md:px-6 lg:px-8 py-8">
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
      ) : isLoading ? (
        <MovieGridSkeleton />
      ) : movies.length > 0 ? (
        <div className="container mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 px-4 md:px-6 lg:px-8 py-6">
            {movies.map((movie) => (
              <MovieCard key={movie.id} {...movie} onClick={() => handleMovieClick(movie.id)} />
            ))}
          </div>
        </div>
      ) : (
        <EmptyState
          icon={searchQuery ? Search : Film}
          title={searchQuery ? "No movies found" : "No movies available"}
          description={searchQuery 
            ? `We couldn't find any movies matching "${searchQuery}". Try a different search term.`
            : "We couldn't find any movies matching your filters. Try adjusting your selection or browse all movies."
          }
          actionLabel="Clear Filters"
          onAction={handleClearFilters}
        />
      )}
    </div>
  );
}