import { backtracking } from "../src/algorithms/backtracking";
import { bruteForceSearch } from "../src/algorithms/bruteforce";
import { optimisedBacktracking } from "../src/algorithms/optimisedBacktracking";
import { AnimationFrame } from "../src/animation";
import { DEFAULT_MAX_BOARD_SIZE, generateEmptyBoard, hasQueen, isValidBoard, MIN_BOARD_SIZE, SLOW_ALGORITHMS_MAX_BOARD_SIZE } from "../src/board";

for (let size = MIN_BOARD_SIZE; size < DEFAULT_MAX_BOARD_SIZE; size++) {
    verifyAlgorithm(optimisedBacktracking, size, "Optimised backtracking");
    verifyAlgorithm(backtracking, size, "Backtracking");

    if (size < SLOW_ALGORITHMS_MAX_BOARD_SIZE) {
        verifyAlgorithm(bruteForceSearch, size, "Brute force");
    }
}

function verifyAlgorithm(algorithm: (board: boolean[][]) => AnimationFrame[], size: number, algoName: string) {
    const board = generateEmptyBoard(size);
    const animationFrames = algorithm(board);
    const finalBoard = animationFrames[animationFrames.length - 1].board;

    console.assert(
        isValidBoard(finalBoard),
        `${algoName} has produced an invalid board`
    );

    console.assert(
        computeQueenCount(finalBoard) === size,
        `${algoName} has produced the wrong number of queens. Expected: ${size}, Actual: ${computeQueenCount(finalBoard)}`
    );

    console.assert(
        board.length === size && board[0].length === size,
        `${algoName} has produced a board of wrong dimensions. Expected: ${size} x ${size}, Actual: ${board.length} x ${board[0].length}} `
    );
}

function computeQueenCount(board: boolean[][]) {
    let queenCount = 0;

    for (let row = 0; row < board.length; row++) {
        for (let col = 0; col < board.length; col++) {
            if (hasQueen(row, col, board)) {
                queenCount++;
            }
        }
    }

    return queenCount;
}