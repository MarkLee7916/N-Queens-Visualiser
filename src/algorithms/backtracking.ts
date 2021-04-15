import { AnimationFrame, newAnimationFrame } from "../animation";
import { EMPTY_TILE, isValidBoard, isValidPlacement } from "../board";

// Driver function for backtracking solver
export function backtracking(board: boolean[][]) {
    const animationFrames = [];

    backtrackingRecurse(board, 0, animationFrames);

    return animationFrames;
}

// Solves the N-Queens problem and returns a list of frames to show how it did it
function backtrackingRecurse(board: boolean[][], rowToPlaceAt: number, animationFrames: AnimationFrame[]) {
    if (rowToPlaceAt === board.length) {
        animationFrames.push(newAnimationFrame(board, "Solution found!"));

        return true;
    }

    for (let col = 0; col < board.length; col++) {
        board[rowToPlaceAt][col] = true;

        animationFrames.push(newAnimationFrame(board, "Attempting to place queen..."));

        if (isValidPlacement(board, rowToPlaceAt, col)) {
            animationFrames.push(newAnimationFrame(board, "Placement is valid!"));

            if (backtrackingRecurse(board, rowToPlaceAt + 1, animationFrames)) {
                return true;
            }

        } else {
            animationFrames.push(newAnimationFrame(board, "Placement is invalid, Try again!"));
        }

        board[rowToPlaceAt][col] = EMPTY_TILE;
    }

    animationFrames.push(newAnimationFrame(board, "No valid placement found, backtracking..."));
}

