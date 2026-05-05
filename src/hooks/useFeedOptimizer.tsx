import type { OptimizerInput, OptimizerOutput } from "../data/types";
import { optimizeFeed } from "../logic/optimizer";

export function useFeedOptimizer() {
    const optimize = (input: OptimizerInput): OptimizerOutput => {
        return optimizeFeed(input);
    };

    return { optimize };
}