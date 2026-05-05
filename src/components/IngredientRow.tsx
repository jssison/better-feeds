import type {
  UserIngredientRow,
  SpeciesGroup,
  IngredientKey,
} from "../data/types.ts";
import { INGREDIENTS } from "../data/ingredients.ts";

interface Props {
  row: UserIngredientRow;
  speciesGroup: SpeciesGroup;
  onChange: (row: UserIngredientRow) => void;
  onRemove: () => void;
}

export default function IngredientRow({
  row,
  onChange,
  onRemove,
}: Props) {
  return (
    <div className="grid grid-cols-5 gap-2">
      <select
        value={row.ingredientKey}
        onChange={(e) =>
          onChange({
            ...row,
            ingredientKey: e.target.value as IngredientKey,
          })
        }
        className="border p-2 rounded"
      >
        {Object.values(INGREDIENTS).map((i) => (
          <option key={i.key} value={i.key}>
            {i.label}
          </option>
        ))}
      </select>

      <input
        type="number"
        value={row.costPerKg}
        onChange={(e) =>
          onChange({
            ...row,
            costPerKg: Number(e.target.value),
          })
        }
        className="border p-2 rounded"
      />

      <input
        type="number"
        value={row.minKg}
        onChange={(e) =>
          onChange({
            ...row,
            minKg: Number(e.target.value),
          })
        }
        className="border p-2 rounded"
      />

      <input
        type="number"
        value={row.maxKg}
        onChange={(e) =>
          onChange({
            ...row,
            maxKg: Number(e.target.value),
          })
        }
        className="border p-2 rounded"
      />

      <button
        onClick={onRemove}
        className="text-red-500"
      >
        ✕
      </button>
    </div>
  );
}