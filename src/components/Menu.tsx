import React, { useEffect, useState } from "react";
import { Algorithm, slowAlgorithms } from "../algorithms/algorithm";
import { DEFAULT_MAX_BOARD_SIZE, MIN_BOARD_SIZE, SLOW_ALGORITHMS_MAX_BOARD_SIZE } from "../board";
import { Dropdown } from "./Dropdown";

interface Props {
    message: string
    running: boolean
    animateAlgo: (algorithm: Algorithm) => Promise<void>
    size: number
    delay: number
    setDelay: (delay: number) => void
    setSize: (size: number) => void
}

const algorithmToDescription = new Map<Algorithm, string>([
    [Algorithm.Backtracking, "A barebones implementation of backtracking search"],
    [Algorithm.BruteForce, "Generates all possible boards where each row has a queen, and takes the first one that is valid"],
    [Algorithm.OptimisedBacktracking, "Backtracking with forward checking and heuristics for taking the most constrained variable"]
]);

export const Menu = ({ message, running, animateAlgo, size, delay, setDelay, setSize }: Props) => {
    // The current algorithm the user has selected
    const [algorithm, setAlgorithm] = useState(Algorithm.Backtracking);

    // Hide controls when an algorithm is running to prevent user from breaking the animation
    const controlsVisibility = running ? "hidden" : "visible";

    const colorCodeVisibility = algorithm === Algorithm.OptimisedBacktracking ? "visible" : "hidden";

    // When an algorithm is updated, check if it's a slow algorithm and update board size if needed
    useEffect(() => {
        if (slowAlgorithms.has(algorithm) && size > SLOW_ALGORITHMS_MAX_BOARD_SIZE)
            setSize(SLOW_ALGORITHMS_MAX_BOARD_SIZE);
    }, [algorithm])

    return (
        <>
            <h1 id="heading">N-Queens Visualiser</h1>

            <div id="controls">
                <div style={{ visibility: controlsVisibility }} >
                    <Dropdown
                        initialItem={"Backtracking"}
                        content={new Map<string, () => void>([
                            ["Backtracking", () => setAlgorithm(Algorithm.Backtracking)],
                            ["Brute Force", () => setAlgorithm(Algorithm.BruteForce)],
                            ["Optimised Backtracking", () => setAlgorithm(Algorithm.OptimisedBacktracking)],
                        ])}
                    />
                </div>

                <div className="slider-container">
                    <label htmlFor="speed-slider">
                        Animation Delay:
                    </label>

                    <input
                        type="range"
                        id="speed-slider"
                        defaultValue={delay}
                        min="0"
                        max="3000"
                        onChange={event => setDelay(parseInt(event.target.value))}
                    />

                    <label htmlFor="speed-slider">
                        {`${delay}ms`}
                    </label>
                </div>

                <span id="color-codes" style={{ visibility: colorCodeVisibility }}>🟩 Not clashing with other queens </span>

                <div className="slider-container" style={{ visibility: controlsVisibility }}>
                    <label htmlFor="size-slider">
                        Board Size:
                    </label>

                    <input
                        type="range"
                        id="size-slider"
                        defaultValue={size}
                        min={MIN_BOARD_SIZE}
                        max={slowAlgorithms.has(algorithm) ? SLOW_ALGORITHMS_MAX_BOARD_SIZE : DEFAULT_MAX_BOARD_SIZE}
                        onChange={event => setSize(parseInt(event.target.value))}
                    />

                    <label htmlFor="size-slider">
                        {size}
                    </label>
                </div>

                <button
                    className="menu-button"
                    style={{ visibility: controlsVisibility }}
                    onClick={() => animateAlgo(algorithm)}>
                    Run Algorithm
                </button>
            </div>

            <p id="message">{message === "" ? algorithmToDescription.get(algorithm) : message}</p>
        </>
    )
}