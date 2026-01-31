"use client";

import type { Location } from "@/lib/types/location";
import { cn } from "@/lib/utils";

type CitySuggestionsProps = {
  items: Location[];
  isOpen: boolean;
  isLoading: boolean;
  error: Error | null;
  selectedIndex: number;
  onSelect: (city: Location) => void;
  onHighlight: (index: number) => void;
};

export function CitySuggestions({
  items,
  isOpen,
  isLoading,
  error,
  selectedIndex,
  onSelect,
  onHighlight,
}: CitySuggestionsProps) {
  if (!isOpen) return null;

  const hasItems = items.length > 0;

  return (
    <div
      id="city-suggestions"
      className="absolute left-0 right-0 top-full z-20 mt-2 rounded-xl border bg-background p-1 shadow-lg"
      data-testid="city-suggestions"
      role="listbox"
    >
      {isLoading && (
        <div className="px-3 py-2 text-sm text-muted-foreground">
          読み込み中...
        </div>
      )}
      {error && !isLoading && (
        <div className="px-3 py-2 text-sm text-destructive">
          検索に失敗しました。もう一度試してください。
        </div>
      )}
      {!isLoading && !error && !hasItems && (
        <div className="px-3 py-2 text-sm text-muted-foreground">
          候補が見つかりませんでした。
        </div>
      )}
      {!isLoading &&
        !error &&
        items.map((item, index) => (
          <button
            key={item.id}
            type="button"
            className={cn(
              "flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition",
              index === selectedIndex
                ? "bg-muted text-foreground"
                : "hover:bg-muted/60",
            )}
            onMouseDown={(event) => {
              event.preventDefault();
              onSelect(item);
            }}
            onMouseEnter={() => onHighlight(index)}
            data-testid="city-suggestion-item"
            role="option"
            aria-selected={index === selectedIndex}
          >
            <span className="font-medium">{item.name}</span>
            <span className="text-xs text-muted-foreground">
              {item.country}
            </span>
          </button>
        ))}
    </div>
  );
}
