import { motion, AnimatePresence } from "framer-motion";
import type { UserIngredientRow, SpeciesGroup } from "../data/types";
import IngredientRow from "./IngredientRow";

interface Props {
    ingredients: UserIngredientRow[];
    setIngredients: React.Dispatch<React.SetStateAction<UserIngredientRow[]>>;
    totalFeedKg: number;
    setTotalFeedKg: (v: number) => void;
    speciesGroup: SpeciesGroup;
}

export default function IngredientManager({
    ingredients,
    setIngredients,
    totalFeedKg,
    setTotalFeedKg,
    speciesGroup,
    }: Props) {
    const addRow = () => {
        setIngredients((prev) => [
        ...prev,
        {
            id: crypto.randomUUID(),
            ingredientKey: "yellow_corn",
            costPerKg: 0,
            minKg: 0,
            maxKg: totalFeedKg,
        },
        ]);
    };

    return (
        <div className="space-y-4">
        {/* Total feed input */}
        <div className="flex flex-col sm:flex-row sm:items-end gap-3 pb-4 border-b border-slate-100">
            <div className="flex flex-col gap-1.5 sm:w-48">
            <label className="flex flex-col gap-0.5">
                <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
                Total feed batch
                </span>
                <span className="text-xs text-slate-400">
                Total weight to formulate
                </span>
            </label>
            <div className="relative">
                <input
                type="number"
                min={1}
                value={totalFeedKg}
                onChange={(e) => setTotalFeedKg(Number(e.target.value))}
                className={[
                    "w-full pl-3 pr-10 py-2.5 rounded-xl border-2 border-slate-200 bg-white",
                    "text-slate-900 font-mono text-sm font-semibold",
                    "focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100",
                    "transition-colors duration-150",
                ].join(" ")}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 pointer-events-none">
                kg
                </span>
            </div>
            </div>

            {totalFeedKg > 0 && (
            <p className="text-xs text-slate-400 pb-2.5 sm:pb-[11px]">
                Ingredient min/max bounds apply to this total.
            </p>
            )}
        </div>

        <AnimatePresence initial={false}>
            {ingredients.map((row) => (
                <motion.div
                    key={row.id}
                    initial={{ opacity: 0, y: -8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 20, scale: 0.97 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                >
                    <IngredientRow
                        key={row.id}
                        row={row}
                        speciesGroup={speciesGroup}
                        onChange={(updated) =>
                            setIngredients((prev) =>
                            prev.map((r) => (r.id === row.id ? updated : r))
                            )
                        }
                        onRemove={() =>
                            setIngredients((prev) => prev.filter((r) => r.id !== row.id))
                        }
                    />
                </motion.div>
            ))}
        </AnimatePresence>

        {/* Add ingredient button */}
        <button
            onClick={addRow}
            className={[
            "w-full flex items-center justify-center gap-2",
            "py-3 rounded-xl border-2 border-dashed border-emerald-300",
            "text-sm font-semibold text-emerald-700",
            "hover:bg-emerald-50 hover:border-emerald-500",
            "transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600",
            ].join(" ")}
        >
            <span className="text-lg leading-none">+</span>
            Add ingredient
        </button>

        {ingredients.length === 0 && (
            <p className="text-center text-xs text-slate-400 -mt-2">
            Add at least one ingredient to proceed.
            </p>
        )}
        </div>
    );
}