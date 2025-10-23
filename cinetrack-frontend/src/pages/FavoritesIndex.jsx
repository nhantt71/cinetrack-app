import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import EmptyState from "@/components/EmptyState";
import { Heart } from "lucide-react";
import { AuthService } from "@/services/AuthService";

export default function FavoritesIndex() {
  const navigate = useNavigate();

  useEffect(() => {
    if (AuthService.isAuthenticated()) {
      const user = AuthService.getCurrentUser();
      if (user && user.UserID) {
        navigate(`/favorites/${user.UserID}`, { replace: true });
      }
    }
  }, [navigate]);

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-display font-bold mb-8 flex items-center gap-3">
          <Heart className="h-7 w-7 text-primary" /> Favorites
        </h1>
        <EmptyState
          icon={Heart}
          title="Please sign in to view your favorites"
          description="Sign in to see and manage your favorite movies."
          actionLabel="Sign in"
          onAction={() => navigate("/auth")}
        />
      </div>
    </div>
  );
}


