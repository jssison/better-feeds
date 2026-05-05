import type { UserIngredientRow, SpeciesGroup } from "../data/types";
import IngredientRow from "./IngredientRow";

interface Props {
  ingredients: UserIngredientRow[];
  setIngredients: React.Dispatch<
    React.SetStateAction<UserIngredientRow[]>
  >;
  totalFeedKg: number;
  setTotalFeedKg: (v: number) => void;
  speciesGroup: SpeciesGroup;
}

export default function IngredientManager({
    ingredients,
    setIngredients,
    totalFeedKg,
    setTotalFeedKg,
    speciesGroup
}: Props) {
    const addRow = () => {
        setIngredients((prev:any) => [
            ...prev,
            {
                id: crypto.randomUUID(),
                ingredientKey: "yellow_corn",
                costPerKg: 0,
                minKg: 0,
                maxKg: totalFeedKg,
            }
        ])
    };

    return (
        <div className="space-y-2">
            <div className="flex gap-2">
                <input
                    type="number"
                    value={totalFeedKg}
                    onChange={(e) => setTotalFeedKg(+e.target.value)}
                    className="p-2 border rounded-lg w-32"
                />
                <span className="self-center text-sm">kg</span>
            </div>

            {ingredients.map((row:any) => (
                <IngredientRow 
                    key={row.id}
                    row={row}
                    speciesGroup={speciesGroup}
                    onChange={(updated:any) =>
                        setIngredients((prev:any) =>
                            prev.map((r:any) => (r.id === row.id ? updated: r))
                        )
                    }
                    onRemove={() => 
                        setIngredients((prev:any) => 
                        prev.filter((r:any) => r.id !== row.id)
                    )}
                />
            ))}

            <button
                onClick={addRow}
                className="w-full border-dashed border-2 p-2 rounded-lg"
            >
                + Add Ingredient
            </button>
        </div>
    )
}