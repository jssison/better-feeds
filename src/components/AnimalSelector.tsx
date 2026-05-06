import { ANIMALS } from "../data/animals";
import type { AnimalOption, AnimalType } from "../data/types";

interface Props {
  animals: AnimalOption[];
  selected: AnimalType | null;
  onSelect: (animal: AnimalOption) => void;
}

const ANIMAL_ICONS: Record<string, string> = {
  broiler:     "🐔",
  layer:       "🥚",
  swine:       "🐷",
  cattle_dairy:"🐄",
  cattle_beef: "🥩",
};

export default function AnimalSelector({ selected, onSelect }: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
      {ANIMALS.map((a) => {
        const isSelected = selected === a.key;
        return (
          <button
            key={a.key}
            onClick={() => onSelect(a)}
            className={[
              "flex flex-col items-center gap-2 p-3 sm:p-4 rounded-xl border-2 text-left",
              "transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600",
              isSelected
                ? "bg-emerald-900 border-emerald-600 shadow-inner"
                : "bg-white border-slate-200 hover:border-emerald-400 hover:bg-emerald-50",
            ].join(" ")}
          >
            <span className="text-2xl leading-none" aria-hidden="true">
              {ANIMAL_ICONS[a.key] ?? "🐾"}
            </span>
            <span
              className={[
                "text-xs sm:text-sm font-semibold text-center leading-tight",
                isSelected ? "text-white" : "text-slate-800",
              ].join(" ")}
            >
              {a.label}
            </span>
            {isSelected && (
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-300">
                Selected
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}