import Hero from "@/components/Hero";
import MovieCarousel from "@/components/MovieCarousel";
import { useLocation } from "wouter";
import { endpoints } from "@/services/backendApi";
import { useState, useEffect } from "react";
import { AuthService } from "@/services/AuthService";


const featuredMovie = {
  title: "Oppenheimer",
  overview: "The story of J. Robert Oppenheimer's role in the development of the atomic bomb during World War II.",
  backdropPath: "https://image.tmdb.org/t/p/original/fm6KqXpk3M2HVveHwCrBSSBaO0V.jpg",
  rating: 8.5,
  year: "2023",
  runtime: 180,
  genres: ["Drama", "History", "Thriller"],
};


export default function HomePage() {
  const [, setLocation] = useLocation();
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  // pagination state not currently used on home, removed to avoid warnings

  const normalizeMovies = (payload) => {
    if (!payload) return [];
    const list = Array.isArray(payload) ? payload : Array.isArray(payload.results) ? payload.results : [];
    return list.map((m) => ({
      id: m.id ?? m.movieId ?? m.tmdbId,
      title: m.title ?? m.name ?? "Untitled",
      posterPath: m.posterPath ?? m.poster_url ?? m.posterUrl ?? m.poster_path,
      rating: typeof m.vote_average === "number" ? m.vote_average : m.rating,
      year: (m.release_date || m.first_air_date || m.year || "").toString().slice(0, 4),
    })).filter((m) => m.id);
  };

  const fetchTrendingMovies = async () => {
    const response = await fetch(endpoints.getTrendingMovies("week"));
    const data = await response.json();
    setTrendingMovies(normalizeMovies(data.data.results));
  };

  const fetchPopularMovies = async () => {
    const response = await fetch(endpoints.getPopularMovies);
    const data = await response.json();
    setPopularMovies(normalizeMovies(data.data.results));
  };

  const fetchTopRatedMovies = async () => {
    const response = await fetch(endpoints.getTopRatedMovies);
    const data = await response.json();
    setTopRatedMovies(normalizeMovies(data.data.results));
  };

  useEffect(() => {
    let isMounted = true;
    const run = async () => {
      try {
        setIsLoading(true);
        await Promise.all([
          fetchTrendingMovies(),
          fetchPopularMovies(),
          fetchTopRatedMovies(),
        ]);
      } catch (_e) {
        if (isMounted) setError("Failed to load movies");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    run();
    return () => { isMounted = false; };
  }, []);


  const handleMovieClick = (movieId) => {
    setLocation(`/movie/${movieId}`);
  };

  const handleAddToWatchlist = async (movieId) => {
    try {
      const user = AuthService.getCurrentUser();
      if (!user || !user.UserID) {
        console.error("User not found");
        return;
      }

      const token = AuthService.getToken();
      if (!token) {
        console.error("Not authenticated");
        return;
      }

      const response = await fetch(endpoints.addToWatchlist(user.UserID, movieId), {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "want_to_watch" }),
      });
      
      if (response.ok) {
        console.log(`Added movie ${movieId} to watchlist`);
      } else {
        console.error("Failed to add to watchlist");
      }
    } catch (error) {
      console.error("Add to watchlist error:", error);
    }
  };

  const handleRemoveFromWatchlist = async (movieId) => {
    try {
      const user = AuthService.getCurrentUser();
      if (!user || !user.UserID) {
        console.error("User not found");
        return;
      }

      const token = AuthService.getToken();
      if (!token) {
        console.error("Not authenticated");
        return;
      }

      const response = await fetch(endpoints.removeFromWatchlist(user.UserID, movieId), {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      
      if (response.ok) {
        console.log(`Removed movie ${movieId} from watchlist`);
      } else {
        console.error("Failed to remove from watchlist");
      }
    } catch (error) {
      console.error("Remove from watchlist error:", error);
    }
  };

  return (
    <div className="min-h-screen">
      <Hero {...featuredMovie} />

      <div className="space-y-12 py-8">
        <MovieCarousel 
          title="Trending This Week" 
          movies={trendingMovies} 
          onMovieClick={handleMovieClick}
          onAddToWatchlist={handleAddToWatchlist}
          onRemoveFromWatchlist={handleRemoveFromWatchlist}
        />
        <MovieCarousel 
          title="Popular Movies" 
          movies={popularMovies} 
          onMovieClick={handleMovieClick}
          onAddToWatchlist={handleAddToWatchlist}
          onRemoveFromWatchlist={handleRemoveFromWatchlist}
        />
        <MovieCarousel 
          title="Top Rated" 
          movies={topRatedMovies} 
          onMovieClick={handleMovieClick}
          onAddToWatchlist={handleAddToWatchlist}
          onRemoveFromWatchlist={handleRemoveFromWatchlist}
        />
      </div>
    </div>
  );
}