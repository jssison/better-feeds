import type { AnimalType, GrowthStage, AnimalOption, NutrientRequirement } from "../data/types";
import { NUTRIENT_REQUIREMENTS } from "../data/nutrient_reqs";

interface Props {
  animal: AnimalOption;
  selected: GrowthStage | null;
  onSelect: (
    stage: GrowthStage,
    req: NutrientRequirement
  ) => void;
}

export default function GrowthStageSelector({
    animal,
    selected,
    onSelect
}: Props) {
    return (
        <div className="space-y-2">
            {animal.stages.map((s) => (
                <button
                    key={s.key}
                    onClick={() => onSelect(s.key, NUTRIENT_REQUIREMENTS[s.key])}
                    className={`w-full p-3 rounded-xl border text-left
                        ${selected === s.key ? "bg-green-200 border-green-600" : "bg-white"}    
                    `}
                >
                    {s.label}
                </button>
            ))}
        </div>
    )
}