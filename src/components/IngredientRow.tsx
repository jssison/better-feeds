import { INGREDIENTS } from "../data/ingredients";
import type { UserIngredientRow } from "../data/types";

export default function IngredientRow({
  row,
  speciesGroup,
  onChange,
  onRemove,
}: {
    row: UserIngredientRow
    speciesGroup: string
    onChange: any
    onRemove: any
}) {
  const ingredient = INGREDIENTS[row.ingredientKey];

  return (
    <div className="grid grid-cols-5 gap-2">
      <select
        value={row.ingredientKey}
        onChange={(e) =>
          onChange({ ...row, ingredientKey: e.target.value })
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
          onChange({ ...row, costPerKg: +e.target.value })
        }
        className="border p-2 rounded"
        placeholder="Cost"
      />

      <input
        type="number"
        value={row.minKg}
        onChange={(e) =>
          onChange({ ...row, minKg: +e.target.value })
        }
        className="border p-2 rounded"
      />

      <input
        type="number"
        value={row.maxKg}
        onChange={(e) =>
          onChange({ ...row, maxKg: +e.target.value })
        }
        className="border p-2 rounded"
      />

      <button onClick={onRemove} className="text-red-500">
        ✕
      </button>
    </div>
  );
}