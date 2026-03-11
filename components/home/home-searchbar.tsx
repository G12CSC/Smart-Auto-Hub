"use client";

import { localStorageAPI } from "@/lib/storage/localStorage";
import { Clock, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export default function HomeSearchbar() {
  const router = useRouter();

  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("all");

  const handleSearch = () => {
    if (searchQuery.trim()) {
      const updated = localStorageAPI.addSearchHistory(searchQuery.trim());
      setSearchHistory(updated);
    }
    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    if (selectedLocation !== "all") params.set("location", selectedLocation);
    router.push(`/vehicles?${params.toString()}`);
  };

  const handleKeyPass = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const clearHistory = () => {
    localStorageAPI.clearSearchHistory();
    setSearchHistory([]);
  };

  const selectHistoryItem = (term) => {
    setSearchQuery(term);
    setShowHistory(false);
  };

  useEffect(() => {
    setSearchHistory(localStorageAPI.getSearchHistory());
  }, []);

  return (
    <div className="bg-card rounded-xl shadow-2xl p-6 md:p-8 border border-border">
      <div className="flex flex-col md:flex-row gap-4 relative">
        <div className="flex-1 relative">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search by Make, Model..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPass}
              onFocus={() => setShowHistory(true)}
              onBlur={() =>
                setTimeout(() => {
                  setShowHistory(false);
                }, 200)
              }
              className="w-full px-6 py-4 rounded-lg bg-input border-2 border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
            />
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
          </div>

          {showHistory && searchHistory.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg z-50 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 border-b border-border">
                <span className="text-sm font-semibold text-muted-foreground">
                  Recent Searches
                </span>
                <button
                  onClick={clearHistory}
                  className="text-xs text-muted-foreground hover:text-foreground transition"
                >
                  Clear
                </button>
              </div>
              {searchHistory.map((term, index) => (
                <button
                  key={index}
                  onClick={() => selectHistoryItem(term)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-secondary/50 transition text-left"
                >
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span>{term}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        <Select value={selectedLocation} onValueChange={setSelectedLocation}>
          <SelectTrigger className="flex-1 py-6 px-6 rounded-lg bg-input border-2 border-border text-foreground">
            <SelectValue placeholder="Filter by Location/Branch..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Locations</SelectItem>
            <SelectItem value="nugegoda">Nugegoda Branch</SelectItem>
            <SelectItem value="colombo">Colombo Branch</SelectItem>
          </SelectContent>
        </Select>
        <Button
          onClick={handleSearch}
          size="lg"
          className="px-8 font-semibold shadow-2xl"
        >
          <Search size={18} className="mr-2" />
          Search
        </Button>
      </div>
    </div>
  );
}
