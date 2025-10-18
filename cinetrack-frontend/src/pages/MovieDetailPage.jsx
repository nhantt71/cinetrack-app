import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Plus, Check, Play } from "lucide-react";
import MovieCarousel from "@/components/MovieCarousel";
import { useState } from "react";
import { useLocation } from "wouter";

//todo: remove mock functionality
const mockMovie = {
  id: 3,
  title: "Inception",
  overview: "A skilled thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O., but his tragic past may doom the project and his team to disaster.",
  backdropPath: "https://image.tmdb.org/t/p/original/s3TBrRGB1iav7gFOCNx3H31MoES.jpg",
  posterPath: "https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
  rating: 8.8,
  year: "2010",
  runtime: 148,
  genres: ["Action", "Science Fiction", "Thriller"],
  cast: [
    { id: 1, name: "Leonardo DiCaprio", character: "Dom Cobb", profilePath: "https://image.tmdb.org/t/p/w185/wo2hJpn04vbtmh0B9utCFdsQhxM.jpg" },
    { id: 2, name: "Joseph Gordon-Levitt", character: "Arthur", profilePath: "https://image.tmdb.org/t/p/w185/z2FA8js799xqtfiFjBTicFYdfk.jpg" },
    { id: 3, name: "Elliot Page", character: "Ariadne", profilePath: "https://image.tmdb.org/t/p/w185/eCeFgzS8H8FdMCkqf01s3e78PCG.jpg" },
    { id: 4, name: "Tom Hardy", character: "Eames", profilePath: "https://image.tmdb.org/t/p/w185/d81K0RH8UX7tZj49tZaQhZ9ewH.jpg" },
    { id: 5, name: "Marion Cotillard", character: "Mal", profilePath: "https://image.tmdb.org/t/p/w185/mf93fpAxGVqznSDi6yDJV2oCujr.jpg" },
  ],
};

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

  const handleWatchlistToggle = () => {
    setInWatchlist(!inWatchlist);
    console.log(inWatchlist ? "Removed from watchlist" : "Added to watchlist");
  };

  const handleSimilarMovieClick = (movieId) => {
    setLocation(`/movie/${movieId}`);
  };

  return (
    <div className="min-h-screen">
      <div className="relative min-h-[50vh] w-full overflow-hidden">
        <img src={mockMovie.backdropPath} alt={mockMovie.title} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />

        <div className="container relative mx-auto flex min-h-[50vh] items-end px-4 md:px-6 lg:px-8 pb-8">
          <div className="flex flex-col md:flex-row gap-8 items-end">
            <img src={mockMovie.posterPath} alt={mockMovie.title} className="w-48 md:w-56 rounded-lg shadow-2xl hidden sm:block" />

            <div className="flex-1 space-y-4 pb-4">
              <div className="space-y-2">
                <h1 className="text-4xl md:text-5xl font-display font-bold text-white drop-shadow-lg">{mockMovie.title}</h1>

                <div className="flex flex-wrap items-center gap-3 text-sm md:text-base">
                  <div className="flex items-center gap-1 text-white">
                    <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                    <span className="font-semibold text-lg">{mockMovie.rating.toFixed(1)}</span>
                  </div>
                  <span className="text-white/90">{mockMovie.year}</span>
                  <span className="text-white/90">{mockMovie.runtime} min</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {mockMovie.genres.map((genre) => (
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
                      In Watchlist
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-5 w-5" />
                      Add to Watchlist
                    </>
                  )}
                </Button>
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
          <p className="text-lg text-muted-foreground leading-relaxed max-w-4xl">{mockMovie.overview}</p>
        </div>

        <div>
          <h2 className="text-2xl font-display font-semibold mb-6">Cast</h2>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {mockMovie.cast.map((actor) => (
              <div key={actor.id} className="flex-none w-32 text-center space-y-2">
                {actor.profilePath ? (
                  <img src={actor.profilePath} alt={actor.name} className="w-32 h-32 rounded-full object-cover mx-auto" />
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
            ))}
          </div>
        </div>

        <MovieCarousel title="Similar Movies" movies={similarMovies} onMovieClick={handleSimilarMovieClick} />
      </div>
    </div>
  );
}