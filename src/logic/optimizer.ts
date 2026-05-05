/*
    LP Solver
    Minimize cost, maximize nutrients

    Subject to:
        - totalFeedKg 
        - minimum protein
        - minimum energy

    Algorithm Overview:
        1. Validate bounds
        2. Allocate all minimums, then fill cheapest-first (greedy algo)
        3. Iteratively swap 1kg to reduce low-nutrient, increase high nutrient ingredient
        4. Check feasibility (return descriptive error if infeasible)
*/

import { INGREDIENTS } from "../data/ingredients";
import type { OptimizerInput, OptimizerOutput, IngredientResult, UserIngredientRow, NutrientRequirement } from "../data/types";
import { getME, getProtein } from "./helpers";

export function optimizeFeed(input: OptimizerInput): OptimizerOutput {
    const { ingredients, nutrientRequirements, totalFeedKg, speciesGroup } = input;
    const n = ingredients.length;

    if (n === 0) {
        //no selected ingredients -> automatically infeasible
        return buildInfeasible(
            "No ingredients selected.",
            ingredients,
            nutrientRequirements,
            totalFeedKg
        );
    }

    //else, start optimization
    const costs = ingredients.map((i) => i.costPerKg);
    //divide by 100 (protein in %)
    const proteins = ingredients.map((i) => getProtein(i.ingredientKey) / 100);
    //metabolizable energies
    const energies = ingredients.map((i) => getME(i.ingredientKey, speciesGroup));
    const maxArr = ingredients.map((i) => Math.min(i.maxKg, totalFeedKg));
    const minArr = ingredients.map((i) => i.minKg);

    //check bounds
    const minSum = minArr.reduce((a,b) => a+b, 0);
    const maxSum = maxArr.reduce((a,b) => a+b, 0);

    //if total minimum kg exceeds the total feed constraint -> infeasible
    if (minSum > totalFeedKg + 1e-6) {
        return buildInfeasible(
            "Sum of minimum inclusions exceed total feed required.",
            ingredients,
            nutrientRequirements,
            totalFeedKg
        );
    }

    //if total maximum kg does not meet the total feed constraint
    if (maxSum < totalFeedKg - 1e-6) {
        return buildInfeasible(
            "Sum of maximum inclusions is less than total feed required.",
            ingredients,
            nutrientRequirements,
            totalFeedKg
        );
    }

    const reqProteinKg = (nutrientRequirements.crudeProtein / 100) * totalFeedKg;
    const reqEnergyKcal = nutrientRequirements.metabolizableEnergy * totalFeedKg;

    //Greedy algo below
    const amounts = [...minArr];
    //remaining feed kg
    let remaining = totalFeedKg - amounts.reduce((a,b) => a+b, 0);

    //ascending costs array
    const idxByCostAsc = Array.from({ length:n }, (_, i) => i).sort(
        (a,b) => costs[a] - costs[b]
    );

    for (const idx of idxByCostAsc) {
        const canAdd = Math.min(maxArr[idx] - amounts[idx], remaining);
        
        //if algo can still add feed, update ingredient kg and remaining kg
        if (canAdd > 1e-9) {
            amounts[idx] += canAdd;
            remaining -= canAdd;
        }

        //if can't add anymore, stop the algorithm (not worth pursuing the other ingredients)
        if (remaining <= 1e-9) {
            break;
        }
    }

    //if there are still remaining kg to be filled -> infeasible
    if (remaining > 1e-9) {
        return buildInfeasible(
            "Cannot fill the required total feed weight within the given bounds.",
            ingredients,
            nutrientRequirements,
            totalFeedKg
        );
    }

    //swapping mechanic below
    const MAX_ITER = 500; //max iterations

    for (let iter = 0; iter < MAX_ITER; iter++) {
        const totalProtein = dot(proteins, amounts);
        const totalEnergy = dot(energies, amounts);

        //flags to check if nutrient requirements have been reached
        const proteinOk = totalProtein >= reqProteinKg - 1e-6;
        const energyOk = totalEnergy >= reqEnergyKcal - 1e-6;

        //stop swapping if nutrient requirement is reached
        if (proteinOk && energyOk) break;

        //flag to check which nutrient constraint to fix
        const fixProtein = !proteinOk && (
            !energyOk
            ? (reqProteinKg - totalProtein) / reqProteinKg >= (reqEnergyKcal - totalEnergy) / reqEnergyKcal
            : true
        );

        const nutrientArr = fixProtein ? proteins : energies;
        //ascending and descending nutrient arrays
        const byAsc = [...Array(n).keys()].sort((a,b) => nutrientArr[a] - nutrientArr[b]);
        const byDesc = [...Array(n).keys()].sort((a,b) => nutrientArr[b] - nutrientArr[a]);
    
        let reduced = -1;
        let increased = -1;

        //get which ingredient to reduce
        for (const r of byAsc) {
            if (amounts[r] - minArr[r] > 1e-9) {
                reduced = r;
                break;
            }
        }

        //get which ingredient to increase
        for (const inc of byDesc) {
            if (amounts[inc] < maxArr[inc] - 1e-9 && inc != reduced) {
                increased = inc;
                break;
            }
        }

        //no further improvements
        if (reduced === -1 || increased === -1) break;

        //get how much to swap (in kg)
        const swap = Math.min(
            amounts[reduced] - minArr[reduced],
            maxArr[increased] - amounts[increased],
            1.0 //1kg swap
        );

        //perform swap
        amounts[reduced] -= swap;
        amounts[increased] += swap;
    }

    //final feasibility check
    const finalProtein = dot(proteins, amounts);
    const finalEnergy = dot(energies, amounts);
    const finalWeight = amounts.reduce((a,b) => a+b, 0);

    const proteinOk = finalProtein >= reqProteinKg - 0.01;
    const energyOk = finalEnergy >= reqEnergyKcal - 1;
    const weightOk = Math.abs(finalWeight - totalFeedKg) < 0.5;

    if (!proteinOk || !energyOk || !weightOk) {
        //infeasibility reason/s
        const reasons: string[] = [];

        if (!proteinOk) {
            reasons.push(
                `PROTEIN: Achieved ${r2((finalProtein / totalFeedKg) * 100)}% versus required ${nutrientRequirements.crudeProtein}%`
            );
        }

        if (!energyOk) {
            reasons.push(
                `ENERGY: Achieved ${r2(finalEnergy / totalFeedKg)} kcal/kg versus required ${nutrientRequirements.metabolizableEnergy} kcal/kg`
            );
        }

        return buildInfeasible(
            `The selected ingredients cannot meet the required nutrient levels under the given constraints. ${reasons.join("; ")}.`,
            ingredients,
            nutrientRequirements,
            totalFeedKg
        );

    }

    //build output
    const composition: IngredientResult[] = ingredients.map((ing, i) => ({
        ingredientKey: ing.ingredientKey,
        label: INGREDIENTS[ing.ingredientKey].label,
        amountKg: r2(amounts[i]),
        costContribution: r2(amounts[i] * costs[i]),
        proteinContributionKg: r4(proteins[i] * amounts[i]),
        energyContributionKcal: r2(energies[i] * amounts[i])
    }));

    return {
        feasible: true,
        composition,
        totalCost: r2(composition.reduce((s, c) => s + c.costContribution, 0)),
        totalWeightKg: r2(finalWeight),
        nutrients: [
            {
                name: "Crude Protein",
                achieved: r2((finalProtein / totalFeedKg) * 100),
                required: nutrientRequirements.crudeProtein,
                unit: "%",
                met: proteinOk
            },
            {
                name: "Metabolizable Energy",
                achieved: Math.round(finalEnergy / totalFeedKg),
                required: nutrientRequirements.metabolizableEnergy,
                unit: "kcal/kg",
                met: energyOk
            }
        ]
    }
}

//utility functions
function dot(a: number[], b: number[]): number {
    return a.reduce((s, v, i) => s + v * b[i], 0);
}

//rounding funcs
const r2 = (val: number) => Math.round(val * 100) / 100;
const r4 = (val: number) => Math.round(val * 10000) / 10000;

function buildInfeasible(
    reason: string,
    ingredients: UserIngredientRow[],
    req: NutrientRequirement,
    totalFeedKg: number
): OptimizerOutput {
    return {
        feasible: false,
        infeasibleReason: reason,
        composition: ingredients.map((ing) => ({
            ingredientKey: ing.ingredientKey,
            label: INGREDIENTS[ing.ingredientKey].label,
            amountKg: 0,
            costContribution: 0,
            proteinContributionKg: 0,
            energyContributionKcal: 0
        })),
        totalCost: 0,
        totalWeightKg: totalFeedKg,
        nutrients: [
            {name: "Crude Protein", achieved: 0, required: req.crudeProtein, unit: "%", met:false},
            {name: "Metabolizable Energy", achieved: 0, required: req.metabolizableEnergy, unit: "kcal/kg", met:false}
        ]
    }
}