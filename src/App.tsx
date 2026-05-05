"use client";

import { useState } from "react";
import "./App.css"

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
import { NUTRIENT_REQUIREMENTS } from "./data/nutrient_reqs";

export default function FeedOptimizer() {
  const [animalType, setAnimalType] = useState<AnimalType | null>(null);
  const [growthStage, setGrowthStage] = useState<GrowthStage | null>(null);
  const [speciesGroup, setSpeciesGroup] = useState<SpeciesGroup | null>(null);

  const [nutrients, setNutrients] = useState<NutrientRequirement>({
    crudeProtein: 0,
    metabolizableEnergy: 0,
  });

  const [ingredients, setIngredients] = useState<UserIngredientRow[]>([]);
  const [totalFeedKg, setTotalFeedKg] = useState<number>(100);

  const [result, setResult] = useState<OptimizerOutput | null>(null);

  const { optimize } = useFeedOptimizer();

  const selectedAnimal: AnimalOption | undefined = ANIMALS.find(
    (a) => a.key === animalType
  );

  const canOptimize =
    !!animalType &&
    !!growthStage &&
    !!speciesGroup &&
    ingredients.length > 0;

  const handleSelectAnimal = (animal: AnimalOption) => {
    setAnimalType(animal.key);
    setSpeciesGroup(animal.speciesGroup);

    // reset downstream state
    setGrowthStage(null);
    setIngredients([]);
    setResult(null);
  };

  const handleSelectStage = (stage: GrowthStage) => {
    setGrowthStage(stage);

    const req = NUTRIENT_REQUIREMENTS[stage];

    setNutrients({
      crudeProtein: req.crudeProtein,
      metabolizableEnergy: req.metabolizableEnergy,
    });

    setResult(null);
  };

  const handleOptimize = () => {
    if (!animalType || !growthStage || !speciesGroup) return;

    const output = optimize({
      animalType,
      growthStage,
      speciesGroup,
      nutrientRequirements: nutrients,
      ingredients,
      totalFeedKg,
    });

    setResult(output);
  };

  return (
    <div className="min-h-screen bg-green-50 py-6 px-4">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-green-900">
            🌾 Feed Formulation Optimizer
          </h1>
          <p className="text-sm text-green-700">
            Least-cost ration balancing
          </p>
        </div>

        {/* Step 1: Animal */}
        <div className="bg-white p-4 rounded-xl border space-y-3">
          <h2 className="font-semibold text-green-900">
            1. Select Animal
          </h2>

          <AnimalSelector
            animals={ANIMALS}
            selected={animalType}
            onSelect={handleSelectAnimal}
          />
        </div>

        {/* Step 2: Stage */}
        {selectedAnimal && (
          <div className="bg-white p-4 rounded-xl border space-y-3">
            <h2 className="font-semibold text-green-900">
              2. Growth Stage
            </h2>

            <GrowthStageSelector
              animal={selectedAnimal}
              selected={growthStage}
              onSelect={handleSelectStage}
            />
          </div>
        )}

        {/* Step 3: Nutrients */}
        {growthStage && (
          <div className="bg-white p-4 rounded-xl border space-y-3">
            <h2 className="font-semibold text-green-900">
              3. Nutrient Requirements
            </h2>

            <NutrientEditor
              value={nutrients}
              onChange={setNutrients}
            />
          </div>
        )}

        {/* Step 4: Ingredients */}
        {growthStage && speciesGroup && (
          <div className="bg-white p-4 rounded-xl border space-y-3">
            <h2 className="font-semibold text-green-900">
              4. Ingredients
            </h2>

            <IngredientManager
              ingredients={ingredients}
              setIngredients={setIngredients}
              totalFeedKg={totalFeedKg}
              setTotalFeedKg={setTotalFeedKg}
              speciesGroup={speciesGroup}
            />
          </div>
        )}

        {/* Optimize Button */}
        {canOptimize && (
          <button
            onClick={handleOptimize}
            className="w-full bg-green-700 hover:bg-green-800 text-white py-3 rounded-xl font-bold shadow"
          >
            ⚗️ Optimize Feed
          </button>
        )}

        {/* Results */}
        {result && (
          <div className="bg-white p-4 rounded-xl border">
            <ResultPanel result={result} />
          </div>
        )}
      </div>
    </div>
  );
}