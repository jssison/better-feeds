import { ANIMALS } from "../data/animals";
import { INGREDIENTS } from "../data/ingredients";
import { NUTRIENT_REQUIREMENTS } from "../data/nutrient_reqs";
import type { AnimalType, GrowthStage, GrowthStageOption, IngredientKey, NutrientRequirement, SpeciesGroup, UserIngredientRow } from "../data/types";

//get nutrient requirement based on growth stage
export function getNutrientRequirement(stage: GrowthStage): NutrientRequirement {
    return NUTRIENT_REQUIREMENTS[stage];
}

//get metabolizable energy of an ingredient based on species
export function getME(key: IngredientKey, group: SpeciesGroup): number {
    return INGREDIENTS[key].nutrients.me[group];
}

//get crude protein for an ingredient
export function getProtein(key: IngredientKey): number {
    return INGREDIENTS[key].nutrients.protein;
}

//resolve species group from animal type
export function getSpeciesGroup(animal: AnimalType): SpeciesGroup {
    return ANIMALS.find((a) => a.key === animal)?.speciesGroup ?? "poultry";
}

//get growth stages option based on animal type
export function getStages(animal: AnimalType): GrowthStageOption[] {
    return ANIMALS.find((a) => a.key === animal)?.stages ?? [];
}

//create a blank ingredient row
export function createIngredientRow(id: string, key: IngredientKey = "yellow_corn"): UserIngredientRow {
    return { id, ingredientKey: key, costPerKg: 0, minKg: 0, maxKg: 100 };
}