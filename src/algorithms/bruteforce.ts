import { AnimationFrame, newAnimationFrame } from "../animation";
import { isValidBoard } from "../board";
import { deepCopy } from "../utils";

export function bruteForceSearch(board: boolean[][]) {
    const animationFrames: AnimationFrame[] = [];
    const possibleBoards = computeAllBoards(deepCopy(board), 0, 0, 0);

    animationFrames.push(newAnimationFrame(board, "Generating all possible permutations of N queens..."));

    for (let i = 0; i < possibleBoards.length; i++) {
        animationFrames.push(newAnimationFrame(possibleBoards[i], "Considering board..."));

        if (isValidBoard(possibleBoards[i])) {
            animationFrames.push(newAnimationFrame(possibleBoards[i], "Solution Found!"));

            break;
        }
    }

    return animationFrames;
}

// Return a list of all possible boards where each queen has its own row and there's exactly board.length queens
function computeAllBoards(board: boolean[][], row: number, col: number, queenCount: number) {
    let possibleBoards = [];

    if (col === board.length) {
        col = 0;
        row++;
    }

    if (row === board.length || queenCount > board.length) {
        return possibleBoards;
    }

    addBoardIfCorrectQueenCount(board, queenCount, possibleBoards);
    possibleBoards = possibleBoards.concat(computeAllBoards(deepCopy(board), row, col + 1, queenCount));

    board[row][col] = true;
    addBoardIfCorrectQueenCount(board, queenCount + 1, possibleBoards);
    possibleBoards = possibleBoards.concat(computeAllBoards(deepCopy(board), row + 1, 0, queenCount + 1));

    return possibleBoards;
}

// Add a board to the list iff it has the right number of queens
function addBoardIfCorrectQueenCount(board: boolean[][], queenCount: number, possibleBoards: boolean[][][]) {
    if (queenCount === board.length) {
        possibleBoards.push(deepCopy(board));
    }
}

