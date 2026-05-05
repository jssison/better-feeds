export type AnimalType = 
    "broiler"
    | "layer"
    | "swine"
    | "cattle_dairy"
    | "cattle_beef";

export type GrowthStage =
    //broiler
    "broiler_starter"
    | "broiler_grower"
    | "broiler_finisher"

    //layer
    | "layer_starter"
    | "layer_grower"
    | "layer_production"

    //swine
    | "swine_starter"
    | "swine_grower"
    | "swine_finisher"

    //cattle (dairy)
    | "dairy_heifer"
    | "dairy_lactating"
    | "dairy_dry"

    //cattle (beef)
    | "beef_growing"
    | "beef_finishing";

export type IngredientKey = 
    "yellow_corn"
    | "soybean_meal"
    | "rice_bran"
    | "copra_meal"
    | "fish_meal"
    | "wheat_pollard"
    | "molasses"
    | "cassava_meal";

export type SpeciesGroup = 
    "poultry"
    | "swine"
    | "cattle";

export interface NutrientRequirement {
    crudeProtein: number
    metabolizableEnergy: number
}

//metabolizable energy by species
export interface MEBySpecies {
    poultry: number
    swine: number
    cattle: number
}

export interface NutrientProfile {
    protein: number;
    me: MEBySpecies
}

export interface Ingredient {
    key: IngredientKey
    label: string
    nutrients: NutrientProfile
}

export interface GrowthStageOption {
    key: GrowthStage
    label: string
    age?: string
    weightRange?: string
}

export interface AnimalOption {
    key: AnimalType;
    label: string
    speciesGroup: SpeciesGroup
    stages: GrowthStageOption[]
}

export interface UserIngredientRow {
    id: string //for react keys
    ingredientKey: IngredientKey
    costPerKg: number
    minKg: number
    maxKg: number
}

export interface OptimizerInput {
    animalType: AnimalType
    growthStage: GrowthStage
    speciesGroup: SpeciesGroup
    nutrientRequirements: NutrientRequirement
    ingredients: UserIngredientRow[]
    totalFeedKg: number
}

export interface IngredientResult {
    ingredientKey: IngredientKey
    label: string
    amountKg: number
    costContribution: number
    proteinContributionKg: number
    energyContributionKcal: number
}

export interface NutrientResult {
    name: string
    achieved: number
    required: number
    unit: string
    met: boolean //if requirement was met
}

export interface OptimizerOutput {
    feasible: boolean //if there is a feasible solution
    infeasibleReason?: string //if infeasible, what is the reason
    composition: IngredientResult[]
    totalCost: number
    totalWeightKg: number
    nutrients: NutrientResult[]
}