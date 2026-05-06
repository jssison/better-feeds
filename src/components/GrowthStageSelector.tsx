import type { AnimalOption, GrowthStage, NutrientRequirement } from "../data/types";
import { NUTRIENT_REQUIREMENTS } from "../data/nutrient_reqs";

interface Props {
  animal: AnimalOption;
  selected: GrowthStage | null;
  onSelect: (stage: GrowthStage, req: NutrientRequirement) => void;
}

export default function GrowthStageSelector({ animal, selected, onSelect }: Props) {
  return (
    <div className="flex flex-col gap-2">
      {animal.stages.map((s) => {
        const isSelected = selected === s.key;
        const req = NUTRIENT_REQUIREMENTS[s.key];
        return (
          <button
            key={s.key}
            onClick={() => onSelect(s.key, req)}
            className={[
              "w-full flex flex-col sm:flex-row sm:items-center sm:justify-between",
              "gap-1 sm:gap-4 px-4 py-3 rounded-xl border-2 text-left",
              "transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600",
              isSelected
                ? "bg-emerald-900 border-emerald-600"
                : "bg-white border-slate-200 hover:border-emerald-400 hover:bg-emerald-50",
            ].join(" ")}
          >
            {/* Stage label */}
            <span
              className={[
                "text-sm font-semibold leading-snug",
                isSelected ? "text-white" : "text-slate-800",
              ].join(" ")}
            >
              {s.label}
            </span>

            {/* Nutrient badges */}
            <span className="flex gap-2 flex-wrap">
              <span
                className={[
                  "inline-flex items-center gap-1 text-xs font-mono font-medium px-2 py-0.5 rounded-md",
                  isSelected
                    ? "bg-emerald-700 text-emerald-100"
                    : "bg-slate-100 text-slate-500",
                ].join(" ")}
              >
                CP {req?.crudeProtein ?? "—"}%
              </span>
              <span
                className={[
                  "inline-flex items-center gap-1 text-xs font-mono font-medium px-2 py-0.5 rounded-md",
                  isSelected
                    ? "bg-emerald-700 text-emerald-100"
                    : "bg-slate-100 text-slate-500",
                ].join(" ")}
              >
                ME {req?.metabolizableEnergy ?? "—"} kcal/kg
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}