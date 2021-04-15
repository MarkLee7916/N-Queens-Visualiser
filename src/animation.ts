import { generateEmptyBoard } from "./board";
import { deepCopy } from "./utils";

// Represents a state in the animation
export interface AnimationFrame {
    board: boolean[][]
    message: string
    rowToPlaceAt: number
    domainInConsideration: number[]
}

// Return an animation frame with an empty board, no message and no domain information
export function generateEmptyAnimationFrame(size: number) {
    return { board: generateEmptyBoard(size), message: "", rowToPlaceAt: -1, domainInConsideration: [] };
}

// Return an animation frame with the specified board and message, arguments default to not displaying any domain info
export function newAnimationFrame(board: boolean[][], message: string, domainInConsideration: number[] = [], rowToPlaceAt: number = -1) {
    return {
        board: deepCopy(board),
        rowToPlaceAt: rowToPlaceAt,
        message: message,
        domainInConsideration: domainInConsideration,
    };
}

