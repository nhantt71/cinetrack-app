import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Plus, Check, Play, Eye } from "lucide-react";
import MovieCarousel from "@/components/MovieCarousel";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { endpoints } from "@/services/backendApi";
import { AuthService } from "@/services/AuthService";

// Fetched movie state (details only; cast/similar kept mocked for now)
const IMAGE_BASE_POSTER = "https://image.tmdb.org/t/p/w500";
const IMAGE_BASE_BACKDROP = "https://image.tmdb.org/t/p/w1280";

//todo: remove mock functionality
const similarMovies = [
  { id: 4, title: "Interstellar", posterPath: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg", rating: 8.6, year: "2014" },
  { id: 5, title: "The Matrix", posterPath: "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg", rating: 8.7, year: "1999" },
  { id: 2, title: "The Dark Knight", posterPath: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg", rating: 9.0, year: "2008" },
  { id: 7, title: "Pulp Fiction", posterPath: "https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg", rating: 8.9, year: "1994" },
];

export default function MovieDetailPage() {
  const [, setLocation] = useLocation();
  const [inWatchlist, setInWatchlist] = useState(false);
  const [watchlistStatus, setWatchlistStatus] = useState(null); // "want_to_watch" or "watched"
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [movie, setMovie] = useState(null);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [cast, setCast] = useState([]);

  // Derive movieId from URL: /movie/:id
  useEffect(() => {
    const pathParts = window.location.pathname.split('/');
    const maybeId = pathParts[pathParts.length - 1];
    if (!maybeId || Number.isNaN(Number(maybeId))) {
      setError("Invalid movie ID");
      setIsLoading(false);
      return;
    }

    const fetchDetails = async (id) => {
      try {
        setIsLoading(true);
        setError(null);
        const token = AuthService.getToken();
        const resp = await fetch(endpoints.getMovieDetails(id), {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            "Content-Type": "application/json",
          },
        });
        if (!resp.ok) {
          const errText = await resp.text();
          throw new Error(errText || "Failed to fetch movie details");
        }
        const payload = await resp.json();
        const data = payload.data || payload; // support either wrapped or direct TMDB data
        const mapped = {
          id: data.id,
          title: data.title,
          overview: data.overview,
          backdropPath: data.backdrop_path ? `${IMAGE_BASE_BACKDROP}${data.backdrop_path}` : null,
          posterPath: data.poster_path ? `${IMAGE_BASE_POSTER}${data.poster_path}` : null,
          rating: data.vote_average,
          year: data.release_date ? data.release_date.split('-')[0] : null,
          runtime: data.runtime,
          genres: (data.genres || []).map((g) => g.name),
        };
        setMovie(mapped);

        // Fetch similar movies and cast in parallel after details
        const fetchSimilarAndCast = async () => {
          try {
            const [simResp, castResp] = await Promise.all([
              fetch(endpoints.getSimilarMovies(id), {
                headers: {
                  ...(token ? { Authorization: `Bearer ${token}` } : {}),
                  "Content-Type": "application/json",
                },
              }),
              fetch(endpoints.getMovieCredits(id), {
                headers: {
                  ...(token ? { Authorization: `Bearer ${token}` } : {}),
                  "Content-Type": "application/json",
                },
              })
            ]);

            // Handle similar movies
            if (simResp.ok) {
              const simPayload = await simResp.json();
              const simData = (simPayload.data?.results) || simPayload.results || [];
              const mappedSimilar = simData.map((m) => ({
                id: m.id,
                title: m.title || m.name,
                posterPath: m.poster_path ? `${IMAGE_BASE_POSTER}${m.poster_path}` : null,
                rating: m.vote_average,
                year: (m.release_date || m.first_air_date) ? (m.release_date || m.first_air_date).split('-')[0] : null,
              }));
              setSimilarMovies(mappedSimilar);
            } else {
              setSimilarMovies([]);
            }

            // Handle cast
            if (castResp.ok) {
              const castPayload = await castResp.json();
              const castData = (castPayload.data?.cast) || castPayload.cast || [];
              const mappedCast = castData.slice(0, 10).map((actor) => ({
                id: actor.id,
                name: actor.name,
                character: actor.character,
                profilePath: actor.profile_path ? `https://image.tmdb.org/t/p/w185${actor.profile_path}` : null,
              }));
              setCast(mappedCast);
            } else {
              setCast([]);
            }
          } catch (e) {
            console.error("Similar movies or cast fetch error:", e);
            setSimilarMovies([]);
            setCast([]);
          }
        };

        await fetchSimilarAndCast();
      } catch (e) {
        setError("Unable to load movie details");
        console.error("Movie details fetch error:", e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetails(maybeId);
    
    // Check if movie is in watchlist and get its status
    checkWatchlistStatus(maybeId);
  }, []);

  const checkWatchlistStatus = async (movieId) => {
    try {
      const user = AuthService.getCurrentUser();
      if (!user || !user.UserID) {
        return;
      }

      const token = AuthService.getToken();
      if (!token) {
        return;
      }

      const response = await fetch(endpoints.getWatchlist(user.UserID), {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const watchlistData = await response.json();
        const movieInWatchlist = watchlistData.find(item => item.MovieID === parseInt(movieId));
        
        if (movieInWatchlist) {
          setInWatchlist(true);
          setWatchlistStatus(movieInWatchlist.Status);
        } else {
          setInWatchlist(false);
          setWatchlistStatus(null);
        }
      }
    } catch (error) {
      console.error("Error checking watchlist status:", error);
    }
  };

  const handleWatchlistToggle = async () => {
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

      const movieId = window.location.pathname.split('/').pop();
      
      if (inWatchlist) {
        // Remove from watchlist
        const response = await fetch(endpoints.removeFromWatchlist(user.UserID, movieId), {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        
        if (response.ok) {
          setInWatchlist(false);
          setWatchlistStatus(null);
          console.log("Removed from watchlist");
        } else {
          console.error("Failed to remove from watchlist");
        }
      } else {
        // Add to watchlist
        const response = await fetch(endpoints.addToWatchlist(user.UserID, movieId), {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "want_to_watch" }),
        });
        
        if (response.ok) {
          setInWatchlist(true);
          setWatchlistStatus("want_to_watch");
          console.log("Added to watchlist");
        } else {
          console.error("Failed to add to watchlist");
        }
      }
    } catch (error) {
      console.error("Watchlist toggle error:", error);
    }
  };

  const handleMarkAsWatched = async () => {
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

      const movieId = window.location.pathname.split('/').pop();
      
      // Update watchlist status to "watched"
      const response = await fetch(endpoints.updateWatchlist(user.UserID, movieId), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "watched" }),
      });
      
      if (response.ok) {
        setWatchlistStatus("watched");
        console.log("Marked as watched");
      } else {
        console.error("Failed to mark as watched");
      }
    } catch (error) {
      console.error("Mark as watched error:", error);
    }
  };

  const handleSimilarMovieClick = (movieId) => {
    setLocation(`/movie/${movieId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center py-24">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading movie details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-display font-bold mb-4">Movie Details</h1>
          <p className="text-destructive mb-6">{error || "Movie not found"}</p>
          <Button variant="outline" onClick={() => window.history.back()}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="relative min-h-[50vh] w-full overflow-hidden">
        {movie.backdropPath ? (
          <img src={movie.backdropPath} alt={movie.title} className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <div className="absolute inset-0 bg-muted" />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />

        <div className="container relative mx-auto flex min-h-[50vh] items-end px-4 md:px-6 lg:px-8 pb-8">
          <div className="flex flex-col md:flex-row gap-8 items-end">
            {movie.posterPath ? (
              <img src={movie.posterPath} alt={movie.title} className="w-48 md:w-56 rounded-lg shadow-2xl hidden sm:block" />
            ) : null}

            <div className="flex-1 space-y-4 pb-4">
              <div className="space-y-2">
                <h1 className="text-4xl md:text-5xl font-display font-bold text-white drop-shadow-lg">{movie.title}</h1>

                <div className="flex flex-wrap items-center gap-3 text-sm md:text-base">
                  <div className="flex items-center gap-1 text-white">
                    <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                    <span className="font-semibold text-lg">{Number(movie.rating || 0).toFixed(1)}</span>
                  </div>
                  {movie.year ? (<span className="text-white/90">{movie.year}</span>) : null}
                  {movie.runtime ? (<span className="text-white/90">{movie.runtime} min</span>) : null}
                </div>

                <div className="flex flex-wrap gap-2">
                  {movie.genres.map((genre) => (
                    <Badge key={genre} variant="secondary" className="bg-white/10 backdrop-blur-sm text-white border-white/20">
                      {genre}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button size="lg" variant={inWatchlist ? "secondary" : "default"} onClick={handleWatchlistToggle}>
                  {inWatchlist ? (
                    <>
                      <Check className="mr-2 h-5 w-5" />
                      {watchlistStatus === "watched" ? "Watched" : "In Watchlist"}
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-5 w-5" />
                      Add to Watchlist
                    </>
                  )}
                </Button>
                
                {inWatchlist && watchlistStatus === "want_to_watch" && (
                  <Button size="lg" variant="default" onClick={handleMarkAsWatched}>
                    <Eye className="mr-2 h-5 w-5" />
                    Have Watched
                  </Button>
                )}
                
                <Button size="lg" variant="outline" className="bg-white/20 backdrop-blur-md border-white/30 text-white hover:bg-white/30"
                  onClick={() => console.log("Play trailer")}>
                  <Play className="mr-2 h-5 w-5" />
                  Watch Trailer
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-8 space-y-12">
        <div>
          <h2 className="text-2xl font-display font-semibold mb-4">Overview</h2>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-4xl">{movie.overview}</p>
        </div>

        <div>
          <h2 className="text-2xl font-display font-semibold mb-6">Cast</h2>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {cast.length > 0 ? (
              cast.map((actor) => (
              <div key={actor.id} className="flex-none w-32 text-center space-y-2">
                {actor.profilePath ? (
                    <img 
                      src={actor.profilePath} 
                      alt={actor.name} 
                      className="w-32 h-32 rounded-full object-cover mx-auto" 
                    />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center mx-auto">
                    <span className="text-2xl font-bold text-muted-foreground">{actor.name.charAt(0)}</span>
                  </div>
                )}
                <div>
                  <p className="font-semibold text-sm">{actor.name}</p>
                  <p className="text-xs text-muted-foreground">{actor.character}</p>
                </div>
              </div>
              ))
            ) : (
              <div className="text-muted-foreground">Cast information not available</div>
            )}
          </div>
        </div>

        <MovieCarousel title="Similar Movies" movies={similarMovies} onMovieClick={handleSimilarMovieClick} />
      </div>
    </div>
  );
}