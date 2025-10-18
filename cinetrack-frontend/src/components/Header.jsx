import { Search, Film, Heart, List, LogOut, User } from "lucide-react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { endpoints } from "@/services/backendApi";

export default function Header() {
  const [location] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();

  // Check if user is logged in
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const token = localStorage.getItem("token");
      if (token) {
        await fetch(endpoints.logout, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear local storage and redirect regardless of API response
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      setUser(null);
      setIsLoggingOut(false);
      navigate("/");
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log("Search for:", searchQuery);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6 lg:px-8">
        <div className="flex items-center gap-6 md:gap-8">
          <Link href="/" data-testid="link-home">
            <div className="flex items-center gap-2 cursor-pointer hover-elevate active-elevate-2 px-2 py-1 rounded-md -ml-2">
              <Film className="h-7 w-7 text-primary" />
              <span className="text-xl font-display font-bold" onClick={() => navigate("/")}>CineTrack</span>
            </div>
          </Link>
          
          <nav className="hidden md:flex items-center gap-1">
            <Link href="/" data-testid="link-home-nav">
              <Button 
                variant={location === "/" ? "secondary" : "ghost"} 
                size="sm"
                className="toggle-elevate"
                data-active={location === "/"}
                onClick={() => navigate("/")} 
              >
                Home
              </Button>
            </Link>
            <Link href="/search" data-testid="link-search">
              <Button 
                variant={location === "/search" ? "secondary" : "ghost"} 
                size="sm"
                className="toggle-elevate"
                onClick={() => navigate("/search")}
              >
                Browse
              </Button>
            </Link>
            <Link href="/favorites" data-testid="link-favorites">
              <Button 
                variant={location === "/favorites" ? "secondary" : "ghost"} 
                size="sm"
                className="toggle-elevate"
                onClick={() => navigate("/favorites")}
              >
                Favorites
              </Button>
            </Link>
            <Link href="/watchlist" data-testid="link-watchlist">
              <Button 
                variant={location === "/watchlist" ? "secondary" : "ghost"} 
                size="sm"
                className="toggle-elevate"
                onClick={() => navigate("/watchlist")}
              >
                <List className="h-4 w-4 mr-2" />
                Watchlist
              </Button>
            </Link>
          </nav>
        </div>

        <form onSubmit={handleSearch} className="flex-1 max-w-md mx-4 hidden sm:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search movies & TV shows..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10"
              data-testid="input-search"
            />
          </div>
        </form>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Link href="/favorites" data-testid="link-favorites">
                <Button variant="ghost" size="icon" className="hidden sm:inline-flex">
                  <Heart className="h-5 w-5" />
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <span className="hidden sm:block text-sm text-muted-foreground">
                  Welcome, {user.name}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  {isLoggingOut ? "Signing out..." : "Sign out"}
                </Button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/auth")}
                className="flex items-center gap-2"
              >
                <User className="h-4 w-4" />
                Sign in
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}