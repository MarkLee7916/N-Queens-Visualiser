import React, { useRef, useState } from "react"
import { Board } from "./Board"
import { wait } from "../utils"
import { backtracking } from "../algorithms/backtracking";
import { AnimationFrame, generateEmptyAnimationFrame } from "../animation";
import { Menu } from "./Menu";
import { Algorithm } from "../algorithms/algorithm";
import { generateEmptyBoard } from "../board";
import { bruteForceSearch } from "../algorithms/bruteforce";
import { optimisedBacktracking } from "../algorithms/optimisedBacktracking";

const INITIAL_BOARD_SIZE = 7;
const INITIAL_DELAY_MILLIS = 1500;

const algorithmToImplementation = new Map<Algorithm, (board: boolean[][]) => AnimationFrame[]>([
    [Algorithm.Backtracking, backtracking],
    [Algorithm.BruteForce, bruteForceSearch],
    [Algorithm.OptimisedBacktracking, optimisedBacktracking]
]);

export const Visualiser = () => {
    const [isAlgorithmRunning, setAlgorithmRunning] = useState(false);

    // The current frame that is being animated
    const [animationFrame, setAnimationFrame] = useState(generateEmptyAnimationFrame(INITIAL_BOARD_SIZE));

    // The delay in milliseconds between frames 
    const [delay, setDelay] = useState(INITIAL_DELAY_MILLIS);

    // A delay ref that updates syncronously for changing the delay time in the middle of animations 
    const delayRef = useRef(INITIAL_DELAY_MILLIS);

    // Given an algorithm, compute the list of frames and animate them by updating the state every `delay` millseconds
    async function animateAlgorithm(algorithm: Algorithm) {
        const algoImplementation = algorithmToImplementation.get(algorithm);
        const animationFrames = algoImplementation(generateEmptyBoard(animationFrame.board.length));

        setAlgorithmRunning(true);

        for (let i = 0; i < animationFrames.length; i++) {
            setAnimationFrame(animationFrames[i]);

            await wait(delayRef.current);
        }

        setAlgorithmRunning(false);
    }

    function handleSetDelay(value: number) {
        setDelay(value);
        delayRef.current = value;
    }

    function handleSetSize(size: number) {
        setAnimationFrame(generateEmptyAnimationFrame(size));
    }

    return (
        <>
            <Menu
                message={animationFrame.message}
                running={isAlgorithmRunning}
                animateAlgo={animateAlgorithm}
                size={animationFrame.board.length}
                delay={delay}
                setDelay={handleSetDelay}
                setSize={handleSetSize}
            />

            <Board board={animationFrame.board} />
        </>
    )
}