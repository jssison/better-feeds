import type { GrowthStage, NutrientRequirement } from "./types"

export const NUTRIENT_REQUIREMENTS: Record<GrowthStage, NutrientRequirement> = {
    //broiler
    broiler_starter: { crudeProtein: 22, metabolizableEnergy: 3000},
    broiler_grower: { crudeProtein: 20, metabolizableEnergy: 3100 },
    broiler_finisher: { crudeProtein: 18, metabolizableEnergy: 3200 },

    //layer
    layer_starter: { crudeProtein: 18, metabolizableEnergy: 2850 },
    layer_grower: { crudeProtein: 15, metabolizableEnergy: 2750 },
    layer_production: { crudeProtein: 16, metabolizableEnergy: 2800 },

    //swine
    swine_starter: { crudeProtein: 20, metabolizableEnergy: 3250 },
    swine_grower: { crudeProtein: 17, metabolizableEnergy: 3200 },
    swine_finisher: { crudeProtein: 14, metabolizableEnergy: 3200 },

    //cattle (dairy)
    dairy_heifer: { crudeProtein: 14, metabolizableEnergy: 2300 },
    dairy_lactating: { crudeProtein: 16.5, metabolizableEnergy: 2700 },
    dairy_dry: { crudeProtein: 12, metabolizableEnergy: 2000 },

    //cattle (beef)
    beef_growing: { crudeProtein: 12, metabolizableEnergy: 2100 },
    beef_finishing: { crudeProtein: 11, metabolizableEnergy: 2600 }
}