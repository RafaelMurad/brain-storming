"use client";

import { useForgeStore, Technology } from "@/lib/store";
import { cn, DIFFICULTY_LABELS, getDifficultyColor } from "@/lib/utils";
import { Star, ArrowRight } from "lucide-react";

interface TechCardProps {
  tech: Technology;
  onClick: () => void;
}

function TechCard({ tech, onClick }: TechCardProps) {
  return (
    <div onClick={onClick} className="tech-card group">
      <div className="flex items-start justify-between mb-4">
        <div
          className="text-4xl"
          style={{ filter: `drop-shadow(0 0 8px ${tech.color}40)` }}
        >
          {tech.icon}
        </div>
        <span
          className="px-2 py-0.5 rounded-full text-xs font-medium"
          style={{
            backgroundColor: `${getDifficultyColor(tech.difficulty)}20`,
            color: getDifficultyColor(tech.difficulty),
          }}
        >
          {DIFFICULTY_LABELS[tech.difficulty - 1]}
        </span>
      </div>

      <h3 className="font-bold text-lg mb-1">{tech.name}</h3>
      <p className="text-sm text-muted-foreground mb-4">{tech.description}</p>

      <div className="flex items-center justify-between">
        {/* Difficulty stars */}
        <div className="flex items-center gap-0.5">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={cn(
                "difficulty-star",
                star <= tech.difficulty ? "filled fill-current" : "empty"
              )}
            />
          ))}
        </div>

        <span className="text-sm text-primary font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          Explore
          <ArrowRight className="w-4 h-4" />
        </span>
      </div>
    </div>
  );
}

export function TechGrid() {
  const { technologies, selectTechnology, setView } = useForgeStore();

  const handleSelect = (tech: Technology) => {
    selectTechnology(tech);
    setView("explore");
  };

  // Group by category
  const frameworks = technologies.filter((t) => t.category === "framework");
  const libraries = technologies.filter((t) => t.category === "library");
  const languages = technologies.filter((t) => t.category === "language");

  return (
    <div className="space-y-10">
      {/* Frameworks */}
      <section>
        <h2 className="text-xl font-bold mb-4">Frameworks</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {frameworks.map((tech) => (
            <TechCard key={tech.id} tech={tech} onClick={() => handleSelect(tech)} />
          ))}
        </div>
      </section>

      {/* Libraries */}
      {libraries.length > 0 && (
        <section>
          <h2 className="text-xl font-bold mb-4">Libraries</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {libraries.map((tech) => (
              <TechCard key={tech.id} tech={tech} onClick={() => handleSelect(tech)} />
            ))}
          </div>
        </section>
      )}

      {/* Languages */}
      {languages.length > 0 && (
        <section>
          <h2 className="text-xl font-bold mb-4">Languages</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {languages.map((tech) => (
              <TechCard key={tech.id} tech={tech} onClick={() => handleSelect(tech)} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
