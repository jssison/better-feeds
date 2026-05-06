"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion"

import AnimalSelector from "./components/AnimalSelector";
import GrowthStageSelector from "./components/GrowthStageSelector";
import NutrientEditor from "./components/NutrientEditor";
import IngredientManager from "./components/IngredientManager";
import ResultPanel from "./components/ResultPanel";

import { useFeedOptimizer } from "./hooks/useFeedOptimizer";

import type {
  AnimalType,
  GrowthStage,
  SpeciesGroup,
  NutrientRequirement,
  UserIngredientRow,
  OptimizerOutput,
  AnimalOption,
} from "./data/types";

import { ANIMALS } from "./data/animals";
import SplashScreen from "./Splash";

// ─── Step card wrapper ────────────────────────────────────────────────────────

interface StepCardProps {
  step: number;
  title: string;
  subtitle?: string;
  /** Step has a confirmed selection */
  done: boolean;
  /** Step is currently interactive */
  active: boolean;
  children?: React.ReactNode;
}

function StepCard({ step, title, subtitle, done, active, children }: StepCardProps) {
  return (
    <div
      className={[
        "rounded-2xl border-2 transition-all duration-200",
        active
          ? "bg-white border-emerald-700 shadow-sm"
          : done
          ? "bg-emerald-50 border-emerald-200"
          : "bg-white border-slate-100 opacity-50 pointer-events-none select-none",
      ].join(" ")}
    >
      {/* Header row */}
      <div
        className={[
          "flex items-center gap-3 px-5 py-4",
          active && children ? "border-b border-slate-100" : "",
        ].join(" ")}
      >
        {/* Step badge */}

        <AnimatePresence mode="wait">
          <motion.span
            key={done ? "✓" : step}
            initial={{ scale: 0.5, opacity: 0, rotate: -15 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.2, type: "spring", stiffness: 300 }}
          >
              {done ? "✓" : step}
          </motion.span>
        </AnimatePresence>

        <div className="min-w-0">
          <p className="text-sm font-bold text-slate-900 leading-tight">{title}</p>
          {subtitle && (
            <p className="text-xs text-slate-500 mt-0.5 truncate">{subtitle}</p>
          )}
        </div>

        {/* Done chip — show on collapsed done cards */}
        {done && !active && (
          <span className="ml-auto text-[10px] font-bold uppercase tracking-widest text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full flex-shrink-0">
            Done
          </span>
        )}
      </div>

      <AnimatePresence>
        {/* Body — only rendered when active */}
        {active && (
          <motion.div
            key="step-body"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity:0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-5 py-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
      
    </div>
  );
}

// ─── Divider between steps ────────────────────────────────────────────────────

function StepDivider() {
  return (
    <div className="flex justify-center py-0.5" aria-hidden="true">
      <div className="w-0.5 h-4 bg-slate-200 rounded-full" />
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function FeedOptimizer() {
  const [animalType,   setAnimalType]   = useState<AnimalType   | null>(null);
  const [growthStage,  setGrowthStage]  = useState<GrowthStage  | null>(null);
  const [speciesGroup, setSpeciesGroup] = useState<SpeciesGroup | null>(null);

  const [nutrients, setNutrients] = useState<NutrientRequirement>({
    crudeProtein: 0,
    metabolizableEnergy: 0,
  });

  const [ingredients, setIngredients] = useState<UserIngredientRow[]>([]);
  const [totalFeedKg, setTotalFeedKg]  = useState<number>(100);
  const [result, setResult]            = useState<OptimizerOutput | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);

  const { optimize } = useFeedOptimizer();

  const selectedAnimal = ANIMALS.find((a) => a.key === animalType);

  const canOptimize =
    !!animalType && !!growthStage && !!speciesGroup && ingredients.length > 0;

  const [showSplash, setShowSplash] = useState(true);

  // ── Handlers ────────────────────────────────────────────────────────────────

  const handleSelectAnimal = (animal: AnimalOption) => {
    setAnimalType(animal.key);
    setSpeciesGroup(animal.speciesGroup);
    setGrowthStage(null);
    setIngredients([]);
    setResult(null);
  };

  const handleSelectStage = (stage: GrowthStage, req: NutrientRequirement) => {
    setGrowthStage(stage);
    setNutrients({ crudeProtein: req.crudeProtein, metabolizableEnergy: req.metabolizableEnergy });
    setResult(null);
  };

  const handleOptimize = () => {
    if (!animalType || !growthStage || !speciesGroup) return;
    setIsOptimizing(true);

    const DELAY = 1000;

    const solve = (): OptimizerOutput => 
      optimize({
        animalType,
        growthStage,
        speciesGroup,
        nutrientRequirements: nutrients,
        ingredients,
        totalFeedKg,
      })

    Promise.all([
      Promise.resolve(solve()),
      new Promise<void>((res) => setTimeout(res, DELAY)),
    ]).then(([output]) => {
      setResult(output);
      setIsOptimizing(false);
    })
  };

  // ── Step visibility ──────────────────────────────────────────────────────────
  // Each step is "active" if its prerequisite is satisfied.
  const step2Active = !!animalType;
  const step3Active = !!growthStage;
  const step4Active = !!growthStage && !!speciesGroup;

  return (
    <>
      {showSplash && (
        <SplashScreen onComplete={() => setShowSplash(false)} />
      )}
      <motion.div
        initial={{ opacity:0 }}
        animate={{ opacity: showSplash ? 0:1 }}
        transition={{ duration: 0.4 }}
        className="min-h-screen bg-slate-100 py-6 px-4 pb-20"
      >
        <div className="min-h-screen bg-slate-100 py-6 px-4 pb-20">
          <div className="max-w-2xl mx-auto space-y-2">

            {/* ── Page header ──────────────────────────────────────────────────── */}
            <div className="bg-emerald-900 rounded-2xl px-5 py-5 flex items-center gap-4 mb-4">
              <div
                className="w-11 h-11 rounded-xl bg-emerald-700 flex items-center justify-center text-2xl flex-shrink-0"
                aria-hidden="true"
              >
                🌾
              </div>
              <div className="min-w-0">
                <h1 className="text-base sm:text-lg font-bold text-white tracking-tight leading-tight">
                  Feed Formulation Optimizer
                </h1>
                <p className="text-xs sm:text-sm text-emerald-300 mt-0.5">
                  Least-cost ration balancing via linear programming
                </p>
              </div>
            </div>

            {/* ── Step 1: Animal type ──────────────────────────────────────────── */}
            <StepCard
              step={1}
              title="Select animal type"
              done={!!animalType}
              active={true}
            >
              <AnimalSelector
                animals={ANIMALS}
                selected={animalType}
                onSelect={handleSelectAnimal}
              />
            </StepCard>

            <StepDivider />

            {/* ── Step 2: Growth stage ─────────────────────────────────────────── */}
            <StepCard
              step={2}
              title="Select growth stage"
              subtitle={selectedAnimal?.label}
              done={!!growthStage}
              active={step2Active}
            >
              {selectedAnimal && (
                <GrowthStageSelector
                  animal={selectedAnimal}
                  selected={growthStage}
                  onSelect={handleSelectStage}
                />
              )}
            </StepCard>

            <StepDivider />

            {/* ── Step 3: Nutrient requirements ────────────────────────────────── */}
            <StepCard
              step={3}
              title="Nutrient requirements"
              subtitle="Auto-filled from growth stage — edit if needed"
              done={step3Active}
              active={step3Active}
            >
              <NutrientEditor value={nutrients} onChange={setNutrients} />
            </StepCard>

            <StepDivider />

            {/* ── Step 4: Ingredients ──────────────────────────────────────────── */}
            <StepCard
              step={4}
              title="Ingredients &amp; constraints"
              subtitle="Add ingredients, set costs and inclusion bounds"
              done={ingredients.length > 0 && step4Active}
              active={step4Active}
            >
              <IngredientManager
                ingredients={ingredients}
                setIngredients={setIngredients}
                totalFeedKg={totalFeedKg}
                setTotalFeedKg={setTotalFeedKg}
                speciesGroup={speciesGroup!}
              />
            </StepCard>

            {/* ── Optimize button ──────────────────────────────────────────────── */}
            {canOptimize && (
              <div className="pt-2">
                <motion.button
                  onClick={handleOptimize}
                  disabled={isOptimizing}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  className={[
                    "w-full flex items-center justify-center gap-3",
                    "py-4 rounded-2xl font-bold text-base text-white",
                    "focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-400",
                    isOptimizing
                      ? "bg-emerald-700 opacity-70 cursor-wait"
                      : "bg-emerald-800 hover:bg-emerald-700",
                  ].join(" ")}
                >
                  {isOptimizing ? (
                    <>
                      <span className="animate-spin text-lg">⚙️</span>
                      Optimizing…
                    </>
                  ) : (
                    <>
                      <span className="text-lg" aria-hidden="true">⚗️</span>
                      Optimize feed formulation
                    </>
                  )}
                </motion.button>
              </div>
            )}

            {/* ── Results ──────────────────────────────────────────────────────── */}
            <AnimatePresence>
              {result && (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 12 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  <ResultPanel result={result} />
                </motion.div>
              )}
            </AnimatePresence>
            
            {result && (
              <div className="pt-2">
                {/* Section label */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex-1 h-px bg-slate-200" />
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                    Results
                  </span>
                  <div className="flex-1 h-px bg-slate-200" />
                </div>
                {/* Re-optimize hint */}
                <p className="text-center text-xs text-slate-400 mt-4">
                  Adjust ingredients or nutrient requirements above and optimize again.
                </p>
              </div>
            )}

          </div>
        </div>
      </motion.div>
    </>
  );
}