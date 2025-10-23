import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Search } from "lucide-react";
import { useState } from "react";
const sortOptions = [
  { value: "popularity.desc", label: "Popularity" },
  { value: "vote_average.desc", label: "Rating" },
  { value: "release_date.desc", label: "Release Date" },
  { value: "title.asc", label: "Title (A-Z)" },
];

export default function FilterBar({ 
  genres = [], 
  selectedGenres = [], 
  sortBy = "popularity.desc", 
  searchQuery = "",
  onGenreToggle, 
  onSortChange, 
  onSearchChange,
  onClearFilters 
}) {
  const [activeGenres, setActiveGenres] = useState(selectedGenres);
  const [currentSort, setCurrentSort] = useState(sortBy);
  const [searchInput, setSearchInput] = useState(searchQuery);

  const handleGenreClick = (genreId) => {
    // Find the genre name from the genres list
    const genre = genres.find(g => g.id === genreId);
    const genreName = genre ? genre.name : genreId;
    
    // Allow only one genre selection - if clicking the same genre, deselect it
    const newGenres = activeGenres.includes(genreName) ? [] : [genreName];
    
    setActiveGenres(newGenres);
    onGenreToggle?.(genreName);
    console.log("Selected genres:", newGenres);
  };

  const handleSortChange = (value) => {
    setCurrentSort(value);
    onSortChange?.(value);
  };

  const handleClearFilters = () => {
    setActiveGenres([]);
    setCurrentSort("popularity.desc");
    setSearchInput("");
    onClearFilters?.();
  };

  const handleSearchChange = (value) => {
    setSearchInput(value);
    onSearchChange?.(value);
  };

  return (
    <div className="sticky top-16 z-40 border-b border-border bg-background/95 backdrop-blur py-4">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 space-y-4">
        {/* Search Input */}
        <div className="flex items-center gap-4">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search movies..."
                value={searchInput}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-10"
              />
            </div>
          </div>
          
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

          {(activeGenres.length > 0 || searchInput) && (
            <Button variant="ghost" size="sm" onClick={handleClearFilters}>
              <X className="h-4 w-4 mr-1" />Clear Filters
            </Button>
          )}
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm font-medium">Genre:</span>
            {activeGenres.length > 0 && (
              <span className="text-xs text-muted-foreground">(1 selected)</span>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {genres.map((genre) => {
              const genreName = genre.name || genre;
              const genreId = genre.id || genre;
              const isActive = activeGenres.includes(genreId);
              return (
                <Button key={genreId} variant={isActive ? "default" : "outline"} size="sm"
                  className={`rounded-full ${isActive ? "bg-primary" : ""}`}
                  onClick={() => handleGenreClick(genreId)}>
                  {genreName}
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}