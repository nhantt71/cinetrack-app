import Hero from "@/components/Hero";
import MovieCarousel from "@/components/MovieCarousel";
import { useLocation } from "wouter";
import { endpoints } from "@/services/backendApi";
import { useState, useEffect } from "react";


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
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchTrendingMovies = async () => {
    const response = await fetch(endpoints.getTrendingMovies("week"));
    const data = await response.json();
    setTrendingMovies(data);
  };

  const fetchPopularMovies = async () => {
    const response = await fetch(endpoints.getPopularMovies());
    const data = await response.json();
    setPopularMovies(data);
  };

  const fetchTopRatedMovies = async () => {
    const response = await fetch(endpoints.getTopRatedMovies());
    const data = await response.json();
    setTopRatedMovies(data);
  };

  useEffect(() => {
    fetchTrendingMovies();
    fetchPopularMovies();
    fetchTopRatedMovies();
    console.log(trendingMovies);
    console.log(popularMovies);
    console.log(topRatedMovies);
  }, []);


  const handleMovieClick = (movieId) => {
    setLocation(`/movie/${movieId}`);
  };

  return (
    <div className="min-h-screen">
      <Hero {...featuredMovie} />

      <div className="space-y-12 py-8">
        <MovieCarousel title="Trending This Week" movies={trendingMovies} onMovieClick={handleMovieClick} />
        <MovieCarousel title="Popular Movies" movies={popularMovies} onMovieClick={handleMovieClick} />
        <MovieCarousel title="Top Rated" movies={topRatedMovies} onMovieClick={handleMovieClick} />
      </div>
    </div>
  );
}