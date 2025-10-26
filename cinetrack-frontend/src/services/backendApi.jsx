const REACT_APP_API_BASE = "https://haytmwv47e.execute-api.ap-southeast-1.amazonaws.com";
export const API_URL = `${REACT_APP_API_BASE}/dev`;

export const endpoints = {
  addToFavorites: (userId, movieId) => `${API_URL}/favorites/${userId}/${movieId}`,
  getFavorites: (userId) => `${API_URL}/favorites/${userId}`,
  removeFromFavorites: (userId, movieId) => `${API_URL}/favorites/${userId}/${movieId}`,
  getGenres: `${API_URL}/genres/list`,
  getTrendingMovies: (time_window) => `${API_URL}/movies/trending/${time_window}`,
  getMovieDetails: (movieId) => `${API_URL}/movies/${movieId}/details`,
  getSimilarMovies: (movieId) => `${API_URL}/movies/${movieId}/similar`,
  getMovieCredits: (movieId) => `${API_URL}/movies/${movieId}/credits`,
  getPopularMovies: `${API_URL}/movies/popular`,
  getMoviesBySearch: `${API_URL}/movies/search`,
  getMoviesByGenreSearch: `${API_URL}/movies/search-by-genre`,
  getTopRatedMovies: `${API_URL}/movies/top-rated`,
  getWatchlist: (userId) => `${API_URL}/watchlist/${userId}`,
  addToWatchlist: (userId, movieId) => `${API_URL}/watchlist/${userId}/${movieId}`,
  removeFromWatchlist: (userId, movieId) => `${API_URL}/watchlist/${userId}/${movieId}`,
  updateWatchlist: (userId, movieId) => `${API_URL}/watchlist/${userId}/${movieId}`,
  login: `${API_URL}/user/login`,
  register: `${API_URL}/user/register`,
  logout: `${API_URL}/user/logout`,
};
