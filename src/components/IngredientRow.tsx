import type { UserIngredientRow, SpeciesGroup, IngredientKey } from "../data/types";
import { INGREDIENTS } from "../data/ingredients";

interface Props {
  row: UserIngredientRow;
  speciesGroup: SpeciesGroup;
  usedKeys: Set<string>
  onChange: (row: UserIngredientRow) => void;
  onRemove: () => void;
}

// Shared input class
const inputCls = [
  "w-full px-3 py-2 rounded-lg border border-slate-200 bg-white",
  "text-slate-900 font-mono text-sm",
  "focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100",
  "transition-colors duration-150",
].join(" ");

const selectCls = [
  "w-full px-3 py-2 rounded-lg border border-slate-200 bg-white",
  "text-slate-900 text-sm",
  "focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100",
  "transition-colors duration-150 cursor-pointer",
].join(" ");

interface FieldProps {
  label: string;
  children: React.ReactNode;
  className?: string;
}

function Field({ label, children, className = "" }: FieldProps) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
        {label}
      </span>
      {children}
    </div>
  );
}

export default function IngredientRow({ row, speciesGroup, usedKeys, onChange, onRemove }: Props) {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-3">
      {/* Ingredient selector — full width */}
      <div className="flex items-end gap-2">
        <Field label="Ingredient" className="flex-1 min-w-0">
          <select
            value={row.ingredientKey}
            onChange={(e) =>
              onChange({ ...row, ingredientKey: e.target.value as IngredientKey })
            }
            className={selectCls}
          >
            {Object.values(INGREDIENTS).map((i) => {
              const taken = usedKeys.has(i.key) && i.key !== row.ingredientKey;
              
              return(
                <option key={i.key} value={i.key} disabled={taken}>
                  {i.label}{taken ? " (already selected)": ""}
                </option>
              )
            })}
          </select>
        </Field>

        {/* Remove button — aligned to bottom of ingredient row */}
        <button
          onClick={onRemove}
          aria-label="Remove ingredient"
          className={[
            "flex-shrink-0 w-9 h-9 rounded-lg border-2 border-red-200",
            "bg-white text-red-400 hover:bg-red-50 hover:text-red-600 hover:border-red-300",
            "flex items-center justify-center text-base leading-none",
            "transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400",
          ].join(" ")}
        >
          ✕
        </button>
      </div>

      {/* Cost + Min + Max — side by side on all breakpoints */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <Field label="Cost per kg">
          <div className="relative">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-semibold pointer-events-none">
              ₱
            </span>
            <input
              type="number"
              min={0}
              value={row.costPerKg}
              onChange={(e) => onChange({ ...row, costPerKg: Number(e.target.value) })}
              className={`${inputCls} pl-6`}
            />
          </div>
        </Field>
        <div className="grid grid-cols-2 gap-2 sm:col-span-1">
          <Field label="Min inclusion">
            <div className="relative">
              <input
                type="number"
                min={0}
                value={row.minKg}
                onChange={(e) => onChange({ ...row, minKg: Number(e.target.value) })}
                className={`${inputCls} pr-6 sm:pr-8`}
              />
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 pointer-events-none">
                kg
              </span>
            </div>
          </Field>

          <Field label="Max inclusion">
            <div className="relative">
              <input
                type="number"
                min={0}
                value={row.maxKg}
                onChange={(e) => onChange({ ...row, maxKg: Number(e.target.value) })}
                className={`${inputCls} pr-6 sm:pr-8`}
              />
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 pointer-events-none">
                kg
              </span>
            </div>
          </Field>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row gap-1 lg:gap-4 text- text-slate-500 pt-1">
        <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">
          Protein: {" "}
          <span className="font-medium text-slate-800">{INGREDIENTS[row.ingredientKey].nutrients.protein}</span>
          <span className="font-medium text-slate-800">%</span>
        </span>
        <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">
          Metabolizable Energy: {" "}
          <span className="font-medium text-slate-800">{INGREDIENTS[row.ingredientKey].nutrients.me[speciesGroup]}</span>
          <span className="font-medium text-slate-800 lowercase">{" "}kcal/kg</span>
        </span>
      </div>
      
    </div>
  );
}