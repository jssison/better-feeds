import type { AnimalOption } from "./types"

export const ANIMALS: AnimalOption[] = [
    {
        key: "broiler",
        label: "Broiler Chicken",
        speciesGroup: "poultry",
        stages: [
            {key: "broiler_starter", label: "Starter", age: "0-10 days"},
            {key: "broiler_grower", label: "Grower", age: "11-24 days"},
            {key: "broiler_finisher", label: "Finisher", age: "25+ days"}
        ]
    },
    {
        key: "layer",
        label: "Layer Chicken",
        speciesGroup: "poultry",
        stages: [
            {key: "layer_starter", label: "Starter", age: "0-6 weeks"},
            {key: "layer_grower", label: "Grower", weightRange: "7-18 weeks"},
            {key: "layer_production", label: "Production", weightRange: "19+ weeks"}
        ]
    },
    {
        key: "swine",
        label: "Swine",
        speciesGroup: "swine",
        stages: [
            {key: "swine_starter", label: "Starter", weightRange: "10-25 kg"},
            {key: "swine_grower", label: "Grower", weightRange: "25-60 kg"},
            {key: "swine_finisher", label: "Finisher", weightRange: "60-110 kg"}
        ]
    },
    {
        key: "cattle_dairy",
        label: "Cattle (Dairy)",
        speciesGroup: "cattle",
        stages: [
            {key: "dairy_heifer", label: "Heifer", weightRange: "100-250 kg"},
            {key: "dairy_lactating", label: "Lactating Cow", weightRange: "250-500 kg"},
            {key: "dairy_dry", label: "Dry Cow", weightRange: "500+ kg"}
        ]
    },
    {
        key: "cattle_beef",
        label: "Cattle (Beef)",
        speciesGroup: "cattle",
        stages: [
            {key: "beef_growing", label: "Growing", weightRange: "150-350 kg"},
            {key: "beef_finishing", label: "Finishing", weightRange: "350-600+ kg"}
        ]
    }
]