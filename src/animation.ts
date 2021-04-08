import { generateEmptyBoard } from "./board";
import { deepCopy } from "./utils";

// Represents a state in the animation
export interface AnimationFrame {
    board: boolean[][]
    message: string
}

// Return an animation frame with an empty board and no message
export function generateEmptyAnimationFrame(size: number) {
    return { board: generateEmptyBoard(size), message: "" };
}

// Return an animation frame with the specified board and message
export function newAnimationFrame(board: boolean[][], message: string) {
    return { board: deepCopy(board), message: message };
}

