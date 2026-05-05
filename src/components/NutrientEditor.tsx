import type { NutrientRequirement } from "../data/types";

interface Props {
  value: NutrientRequirement;
  onChange: (val: NutrientRequirement) => void;
}

export default function NutrientEditor({
    value,
    onChange
}: Props) {
    return (
        <div className="flex gap-2">
            <input
                type="number"
                value={value.crudeProtein}
                onChange={(e) => 
                    onChange({...value, crudeProtein: +e.target.value})
                }
                className="w-full p-2 border rounded-lg"
                placeholder="Crude Protein %"
            />
            <input
                type="number"
                value={value.metabolizableEnergy}
                onChange={(e) =>
                    onChange({...value, metabolizableEnergy: +e.target.value})
                }
                className="w-full p-2 border rounded-lg"
                placeholder="Metabolizable Energy kcal/kg"
            />
        </div>
    )
}