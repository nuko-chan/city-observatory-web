"use client";

import { useState } from "react";
import type { Location } from "@/lib/types/location";
import { useCitySearch } from "@/features/city-search/model/use-city-search";
import { CitySuggestions } from "@/features/city-search/ui/city-suggestions";

type CitySearchInputProps = {
  onCitySelect: (city: Location) => void;
  placeholder?: string;
  defaultValue?: string;
};

export function CitySearchInput({
  onCitySelect,
  placeholder = "都市名を入力",
  defaultValue = "",
}: CitySearchInputProps) {
  const [query, setQuery] = useState<string>(defaultValue);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  const { data = [], isLoading, error } = useCitySearch(query);

  const handleSelect = (city: Location) => {
    setQuery(city.name);
    setIsOpen(false);
    setSelectedIndex(-1);
    onCitySelect(city);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) return;
    if (data.length === 0) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, data.length - 1));
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
      return;
    }

    if (event.key === "Enter") {
      if (selectedIndex >= 0 && data[selectedIndex]) {
        event.preventDefault();
        handleSelect(data[selectedIndex]);
      }
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      setIsOpen(false);
      setSelectedIndex(-1);
    }
  };

  return (
    <div className="relative w-full">
      <input
        className="h-12 w-full rounded-xl border bg-background px-4 text-base shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
        placeholder={placeholder}
        value={query}
        onChange={(event) => {
          const nextValue = event.target.value;
          setQuery(nextValue);
          setSelectedIndex(-1);
          setIsOpen(nextValue.trim().length >= 2);
        }}
        onFocus={() => {
          if (query.trim().length >= 2) {
            setIsOpen(true);
          }
        }}
        onBlur={() => {
          setIsOpen(false);
        }}
        onKeyDown={handleKeyDown}
        data-testid="city-search-input"
        aria-autocomplete="list"
        aria-expanded={isOpen}
        aria-controls="city-suggestions"
      />
      <CitySuggestions
        items={data}
        isOpen={isOpen}
        isLoading={isLoading}
        error={error}
        selectedIndex={selectedIndex}
        onSelect={handleSelect}
        onHighlight={setSelectedIndex}
      />
    </div>
  );
}
