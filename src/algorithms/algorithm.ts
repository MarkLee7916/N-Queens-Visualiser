export const enum Algorithm {
    Backtracking,
    BruteForce,
    OptimisedBacktracking
}

// The set of algorithms that are too slow for the max board size
export const slowAlgorithms = new Set<Algorithm>([Algorithm.BruteForce]);