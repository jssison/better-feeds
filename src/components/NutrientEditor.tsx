import type { NutrientRequirement } from "../data/types";

interface Props {
  value: NutrientRequirement;
  onChange: (val: NutrientRequirement) => void;
}

interface LabeledInputProps {
  label: string;
  hint: string;
  unit: string;
  value: number;
  onChange: (v: number) => void;
}

function LabeledInput({ label, hint, unit, value, onChange }: LabeledInputProps) {
  return (
    <div className="flex flex-col gap-1.5 flex-1 min-w-0">
      <label className="flex flex-col gap-0.5">
        <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
          {label}
        </span>
        <span className="text-xs text-slate-400">{hint}</span>
      </label>
      <div className="relative">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className={[
            "w-full pr-14 pl-3 py-2.5 rounded-xl border-2 border-slate-200",
            "bg-white text-slate-900 font-mono text-sm font-semibold",
            "focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100",
            "transition-colors duration-150",
          ].join(" ")}
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 pointer-events-none">
          {unit}
        </span>
      </div>
    </div>
  );
}

export default function NutrientEditor({ value, onChange }: Props) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <LabeledInput
        label="Crude Protein"
        hint="Minimum protein content"
        unit="%"
        value={value.crudeProtein}
        onChange={(v) => onChange({ ...value, crudeProtein: v })}
      />
      <LabeledInput
        label="Metabolizable Energy"
        hint="Minimum energy per kg"
        unit="kcal/kg"
        value={value.metabolizableEnergy}
        onChange={(v) => onChange({ ...value, metabolizableEnergy: v })}
      />
    </div>
  );
}