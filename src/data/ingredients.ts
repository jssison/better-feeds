import type { IngredientKey, Ingredient } from "./types"

export const INGREDIENTS: Record<IngredientKey, Ingredient> = {
    yellow_corn: {
        key: "yellow_corn",
        label: "Yellow Corn",
        nutrients: {
            protein: 8.5,
            me: { poultry:3370, swine: 3300, cattle: 3100 }
        }
    },
    soybean_meal: {
        key: "soybean_meal",
        label: "Soybean Meal",
        nutrients: {
            protein: 44,
            me: { poultry:2450 , swine: 2900, cattle: 2600}
        }
    },
    rice_bran: {
        key: "rice_bran",
        label: "Rice Bran",
        nutrients: {
            protein: 12,
            me: { poultry: 2800, swine: 2400, cattle: 2100}
        }
    },
    copra_meal: {
        key: "copra_meal",
        label: "Copra Meal",
        nutrients: {
            protein: 20,
            me: { poultry: 2000, swine: 1900, cattle: 1850}
        }
    },
    fish_meal: {
        key: "fish_meal",
        label: "Fish Meal",
        nutrients: {
            protein: 60,
            me: { poultry: 2850, swine: 3000, cattle: 2700}
        }
    },
    wheat_pollard: {
        key: "wheat_pollard",
        label: "Wheat Pollard",
        nutrients: {
            protein: 15,
            me: { poultry: 2100, swine: 2400, cattle: 2300}
        }
    },
    molasses: {
        key: "molasses",
        label: "Molasses",
        nutrients: {
            protein: 3,
            me: { poultry: 2300, swine: 2350, cattle: 2450}
        }
    },
    cassava_meal: {
        key: "cassava_meal",
        label: "Cassava Meal",
        nutrients: {
            protein: 2.5,
            me: { poultry: 3100, swine: 3200, cattle: 2900}
        }
    }
}

export const INGREDIENT_OPTIONS: Ingredient[] = Object.values(INGREDIENTS);