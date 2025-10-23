import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import EmptyState from "@/components/EmptyState";
import { List } from "lucide-react";
import { AuthService } from "@/services/AuthService";

export default function WatchlistIndex() {
  const navigate = useNavigate();

  useEffect(() => {
    if (AuthService.isAuthenticated()) {
      const user = AuthService.getCurrentUser();
      if (user && user.UserID) {
        navigate(`/watchlist/${user.UserID}`, { replace: true });
      }
    }
  }, [navigate]);

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-display font-bold mb-8">My Watchlist</h1>
        <EmptyState
          icon={List}
          title="Please sign in to view your watchlist"
          description="Sign in to see and manage the movies you want to watch."
          actionLabel="Sign in"
          onAction={() => navigate("/auth")}
        />
      </div>
    </div>
  );
}


