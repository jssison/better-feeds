import { motion, AnimatePresence } from "framer-motion";
import type { UserIngredientRow, SpeciesGroup, IngredientKey } from "../data/types";
import IngredientRow from "./IngredientRow";
import { INGREDIENTS } from "../data/ingredients";

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

    //keep track of selected ingredients
    const usedKeys = new Set(ingredients.map((r) => r.ingredientKey));
    const allUsed = usedKeys.size >= Object.keys(INGREDIENTS).length;

    const addRow = () => {
        const firstUnused = Object.keys(INGREDIENTS).find(
            (k) => !usedKeys.has(k as IngredientKey)
        );

        if (!firstUnused) return;

        setIngredients((prev) => [
        ...prev,
        {
            id: crypto.randomUUID(),
            ingredientKey: firstUnused as IngredientKey,
            costPerKg: 0,
            minKg: 0,
            maxKg: totalFeedKg,
        },
        ]);
    };

    const handleSelectAll = () => {
        const allIngredientKeys = Object.keys(INGREDIENTS) as IngredientKey[];

        const existingKeys = new Set(ingredients.map((r) => r.ingredientKey));
        const missingKeys = allIngredientKeys.filter((k) => !existingKeys.has(k));
    
        const newRows: UserIngredientRow[] = missingKeys.map((k) => ({
            id: crypto.randomUUID(),
            ingredientKey: k,
            costPerKg: 0,
            minKg: 0,
            maxKg: totalFeedKg,
        }));

        setIngredients((prev) => [...prev, ...newRows]);
    }

    const handleClearAll = () => {
        setIngredients([])
    }

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

        {/* Toolbar */}
        <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
            {ingredients.length} / {Object.keys(INGREDIENTS).length} ingredients
            </span>
            <div className="flex gap-2">
                <button
                    onClick={handleSelectAll}
                    disabled={allUsed}
                    className={[
                    "text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors duration-150",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-00",
                    allUsed
                        ? "border-slate-200 text-slate-300 cursor-not-allowed"
                        : "border-emerald-600 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-500",
                    ].join(" ")}
                >
                    Select all
                </button>
                <button
                    onClick={handleClearAll}
                    disabled={ingredients.length === 0}
                    className={[
                    "text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors duration-150",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400",
                    ingredients.length === 0
                        ? "border-slate-200 text-slate-300 cursor-not-allowed"
                        : "border-red-200 text-red-500 hover:bg-red-50 hover:border-red-400",
                    ].join(" ")}
                >
                    Clear all
                </button>
            </div>
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
                        usedKeys={usedKeys}
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
        {!allUsed && (
            <>
                <button
                    onClick={addRow}
                    className={[
                    "w-full flex items-center justify-center gap-2",
                    "py-3 rounded-xl border-2 border-dashed border-emerald-600",
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
            </>
        )}
        
        </div>
    );
}