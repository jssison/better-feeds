import type { OptimizerOutput, IngredientResult, NutrientResult } from "../data/types";
import { motion } from "framer-motion"

const PALETTE = [
  "#065f46", // emerald-800
  "#b45309", // amber-700
  "#1e40af", // blue-800
  "#6d28d9", // violet-700
  "#be185d", // pink-700
  "#0e7490", // cyan-700
  "#b91c1c", // red-700
  "#15803d", // green-700
];

// ── Nutrient card ────────────────────────────────────────────────────────────

function NutrientCard({ n }: { n: NutrientResult }) {
  const pct = n.required > 0 ? Math.min((n.achieved / n.required) * 100, 100) : 0;
  return (
    <div
      className={[
        "flex-1 min-w-0 rounded-xl border-2 p-4",
        n.met
          ? "bg-emerald-50 border-emerald-300"
          : "bg-red-50 border-red-300",
      ].join(" ")}
    >
      {/* Status badge */}
      <div className="flex items-center justify-between mb-3">
        <span
          className={[
            "inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full",
            n.met
              ? "bg-emerald-200 text-emerald-800"
              : "bg-red-200 text-red-800",
          ].join(" ")}
        >
          {n.met ? "✔ Met" : "✘ Not met"}
        </span>
      </div>

      {/* Label */}
      <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-1">
        {n.name}
      </p>

      {/* Values */}
      <p
        className={[
          "font-mono text-2xl font-bold",
          n.met ? "text-emerald-900" : "text-red-800",
        ].join(" ")}
      >
        {n.achieved}
        <span className="text-sm font-semibold ml-1 text-slate-400">{n.unit}</span>
      </p>
      <p className="text-xs text-slate-400 mt-0.5">
        Required: {n.required} {n.unit}
      </p>

      {/* Progress bar */}
      <div className="mt-3 h-1.5 rounded-full bg-slate-200 overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${n.met ? "bg-emerald-600" : "bg-red-500"}`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
        />
      </div>
    </div>
  );
}

// ── Composition row ──────────────────────────────────────────────────────────

function CompositionRow({
  c,
  color,
  totalKg,
}: {
  c: IngredientResult;
  color: string;
  totalKg: number;
}) {
  const pct = totalKg > 0 ? ((c.amountKg / totalKg) * 100).toFixed(1) : "0.0";
  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-slate-100 last:border-0">
      <span
        className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
        style={{ background: color }}
        aria-hidden="true"
      />
      <span className="flex-1 text-sm font-medium text-slate-800 truncate">
        {c.label}
      </span>
      <span className="font-mono text-sm font-semibold text-slate-700 tabular-nums">
        {c.amountKg} kg
      </span>
      <span className="hidden sm:inline font-mono text-xs text-slate-400 w-12 text-right tabular-nums">
        {pct}%
      </span>
      <span className="font-mono text-xs text-slate-500 w-20 text-right tabular-nums">
        ₱{c.costContribution.toFixed(2)}
      </span>
    </div>
  );
}

// ── Main ─────────────────────────────────────────────────────────────────────

export default function ResultPanel({ result }: { result: OptimizerOutput }) {
  // ── Infeasible ─────────────────────────────────────────────────────────────
  if (!result.feasible) {
    return (
      <div className="bg-red-50 border-2 border-red-300 rounded-2xl p-5 space-y-2">
        <div className="flex items-start gap-3">
          <span className="text-xl flex-shrink-0">⚠️</span>
          <div>
            <p className="font-bold text-red-800 text-sm">No feasible solution found</p>
            <p className="text-red-700 text-sm mt-1 leading-relaxed">
              {result.infeasibleReason}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const { composition, totalCost, totalWeightKg, nutrients } = result;

  return (
    <div className="space-y-4">
      {/* ── Cost banner ─────────────────────────────────────────────────────── */}
      <div className="bg-emerald-900 rounded-2xl px-5 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-1">
            Optimal total cost
          </p>
          <p className="font-mono text-3xl sm:text-4xl font-bold text-white tracking-tight">
            ₱{totalCost.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-emerald-400 mt-1">
            for {totalWeightKg} kg of feed · ₱{(totalCost / totalWeightKg).toFixed(2)}/kg
          </p>
        </div>
        <span className="text-5xl opacity-20 hidden sm:block" aria-hidden="true">🌾</span>
      </div>

      {/* ── Nutrient checks ─────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-3">
        {nutrients.map((n) => (
          <NutrientCard key={n.name} n={n} />
        ))}
      </div>

      {/* ── Composition table ───────────────────────────────────────────────── */}
      <div className="bg-white border-2 border-emerald-600 rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100">
          <p className="text-sm font-bold text-slate-800">Feed composition</p>
          <p className="text-xs font-bold text-slate-600">{composition.length} ingredients</p>
        </div>

        {/* Proportional stacked bar */}
        <div className="flex h-2 overflow-hidden px-1 pl-0">
          {composition.map((c, i) => {
            const w = totalWeightKg > 0 ? (c.amountKg / totalWeightKg) * 100 : 0;
            return (
              <div
                key={c.ingredientKey}
                style={{ width: `${w}%`, background: PALETTE[i % PALETTE.length] }}
                title={`${c.label}: ${w.toFixed(1)}%`}
                className={i === 0 ? "" : "border-l border-white rounded-lg"}
              />
            );
          })}
        </div>

        {/* Rows */}
        <div className="px-5 py-1">
          {composition.map((c, i) => (
            <CompositionRow
              key={c.ingredientKey}
              c={c}
              color={PALETTE[i % PALETTE.length]}
              totalKg={totalWeightKg}
            />
          ))}
        </div>

        {/* Column labels for desktop */}
        <div className="hidden sm:flex items-center gap-3 px-5 py-2 bg-slate-50 border-t border-slate-100 text-[10px] font-bold uppercase tracking-widest text-slate-400">
          <span className="w-2.5" />
          <span className="flex-1">Ingredient</span>
          <span className="w-[60px] text-right">Amount</span>
          <span className="w-12 text-right">Share</span>
          <span className="w-20 text-right">Cost</span>
        </div>

        {/* Footer total */}
        <div className="flex items-center justify-between px-5 py-3 bg-emerald-50 border-t border-emerald-100">
          <span className="text-xs font-semibold text-emerald-700">
            Total · {totalWeightKg} kg
          </span>
          <span className="font-mono text-sm font-bold text-emerald-900">
            ₱{totalCost.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>
    </div>
  );
}