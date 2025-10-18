import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X } from "lucide-react";
import { useState } from "react";

const genres = ["Action", "Adventure", "Animation", "Comedy", "Crime", "Documentary", "Drama", "Family", "Fantasy", "Horror", "Romance", "Science Fiction", "Thriller"];
const sortOptions = [
  { value: "popularity.desc", label: "Popularity" },
  { value: "vote_average.desc", label: "Rating" },
  { value: "release_date.desc", label: "Release Date" },
  { value: "title.asc", label: "Title (A-Z)" },
];

export default function FilterBar({ selectedGenres = [], sortBy = "popularity.desc", onGenreToggle, onSortChange, onClearFilters }) {
  const [activeGenres, setActiveGenres] = useState(selectedGenres);
  const [currentSort, setCurrentSort] = useState(sortBy);

  const handleGenreClick = (genre) => {
    const newGenres = activeGenres.includes(genre)
      ? activeGenres.filter((g) => g !== genre)
      : [...activeGenres, genre];
    
    setActiveGenres(newGenres);
    onGenreToggle?.(genre);
    console.log("Selected genres:", newGenres);
  };

  const handleSortChange = (value) => {
    setCurrentSort(value);
    onSortChange?.(value);
  };

  const handleClearFilters = () => {
    setActiveGenres([]);
    setCurrentSort("popularity.desc");
    onClearFilters?.();
  };

  return (
    <div className="sticky top-16 z-40 border-b border-border bg-background/95 backdrop-blur py-4">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium">Sort by:</span>
            <Select value={currentSort} onValueChange={handleSortChange}>
              <SelectTrigger className="w-40">
                {sortOptions.find((s) => s.value === currentSort)?.label || "Sort"}
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {activeGenres.length > 0 && (
            <Button variant="ghost" size="sm" onClick={handleClearFilters}>
              <X className="h-4 w-4 mr-1" />Clear Filters
            </Button>
          )}
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm font-medium">Genres:</span>
            {activeGenres.length > 0 && (
              <span className="text-xs text-muted-foreground">({activeGenres.length} selected)</span>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {genres.map((genre) => {
              const isActive = activeGenres.includes(genre);
              return (
                <Button key={genre} variant={isActive ? "default" : "outline"} size="sm"
                  className={`rounded-full ${isActive ? "bg-primary" : ""}`}
                  onClick={() => handleGenreClick(genre)}>
                  {genre}
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}