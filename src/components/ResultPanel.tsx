import type { OptimizerOutput } from "../data/types";

export default function ResultPanel({ result }: { result: OptimizerOutput}) {
  if (!result.feasible) {
    return (
      <div className="bg-red-100 p-4 rounded-xl text-red-700">
        {result.infeasibleReason}
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-xl space-y-3 border">
      <h2 className="font-bold text-lg">
        Total Cost: ₱{result.totalCost}
      </h2>

      <div>
        {result.nutrients.map((n) => (
          <div key={n.name}>
            {n.name}: {n.achieved}/{n.required} {n.unit}
          </div>
        ))}
      </div>

      <div>
        {result.composition.map((c) => (
          <div key={c.ingredientKey} className="flex justify-between">
            <span>{c.label}</span>
            <span>{c.amountKg} kg</span>
          </div>
        ))}
      </div>
    </div>
  );
}