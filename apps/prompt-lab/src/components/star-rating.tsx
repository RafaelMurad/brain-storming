"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
  showValue?: boolean;
  onChange?: (rating: number) => void;
}

const sizes = {
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-6 h-6",
};

export function StarRating({
  rating,
  maxRating = 5,
  size = "md",
  interactive = false,
  showValue = false,
  onChange,
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const displayRating = hoverRating ?? rating;

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: maxRating }).map((_, i) => {
        const starValue = i + 1;
        const isFilled = starValue <= displayRating;
        const isHalf = starValue === Math.ceil(displayRating) && displayRating % 1 !== 0;

        return (
          <button
            key={i}
            type="button"
            className={cn(
              "star",
              isFilled ? "filled" : "empty",
              !interactive && "cursor-default"
            )}
            onMouseEnter={() => interactive && setHoverRating(starValue)}
            onMouseLeave={() => interactive && setHoverRating(null)}
            onClick={() => interactive && onChange?.(starValue)}
            disabled={!interactive}
          >
            <Star
              className={cn(sizes[size], isFilled && "fill-current")}
            />
          </button>
        );
      })}
      {showValue && (
        <span className="ml-1.5 text-sm font-medium text-muted-foreground">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}

// Detailed rating component with multiple criteria
interface DetailedRatingProps {
  criteria: {
    clarity: number;
    effectiveness: number;
    versatility: number;
    efficiency: number;
  };
  onChange?: (criteria: string, value: number) => void;
  interactive?: boolean;
}

const criteriaLabels: Record<string, { label: string; description: string }> = {
  clarity: { label: "Clarity", description: "How clear and understandable is the prompt" },
  effectiveness: { label: "Effectiveness", description: "How well does it achieve desired results" },
  versatility: { label: "Versatility", description: "How adaptable is it to different scenarios" },
  efficiency: { label: "Efficiency", description: "Token efficiency and response quality" },
};

export function DetailedRating({ criteria, onChange, interactive = true }: DetailedRatingProps) {
  return (
    <div className="space-y-4">
      {Object.entries(criteria).map(([key, value]) => (
        <div key={key} className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">{criteriaLabels[key].label}</label>
            <StarRating
              rating={value}
              size="sm"
              interactive={interactive}
              onChange={(newValue) => onChange?.(key, newValue)}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            {criteriaLabels[key].description}
          </p>
        </div>
      ))}
    </div>
  );
}
