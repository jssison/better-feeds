import type { AnimalType, GrowthStage } from "../data/types";
import { ANIMALS } from "../data/animals";
import { NUTRIENT_REQUIREMENTS } from "../data/nutrient_reqs";

export default function GrowthStageSelector({
    animalType,
    selected,
    onSelect
}: {
    animalType: AnimalType
    selected: GrowthStage
    onSelect: any
}) {
    const animal = ANIMALS.find((a) => a.key === animalType)

    return (
        <div className="space-y-2">
            {animal?.stages.map((s) => (
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