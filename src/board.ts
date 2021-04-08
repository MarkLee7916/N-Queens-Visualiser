// Represents a tile with no queen on it
export const EMPTY_TILE = false;

// The min size of a board for it to be solvable
export const MIN_BOARD_SIZE = 4;

// The max size of the board that slow algorithms can compute without freezing the browser
export const SLOW_ALGORITHMS_MAX_BOARD_SIZE = 6;

// The max size of a board for any algorithm
export const DEFAULT_MAX_BOARD_SIZE = 10;

// Computes the coordinate of any diagonally aligned tile given a starting coordinate, an x offset, and a y offset
const diagonalDirections = [
    (startRow: number, rowoffset: number, startCol: number, colOffset: number) => [startRow - rowoffset - 1, startCol - colOffset - 1],
    (startRow: number, rowoffset: number, startCol: number, colOffset: number) => [startRow - rowoffset - 1, startCol + colOffset + 1],
    (startRow: number, rowoffset: number, startCol: number, colOffset: number) => [startRow + rowoffset + 1, startCol - colOffset - 1],
    (startRow: number, rowoffset: number, startCol: number, colOffset: number) => [startRow + rowoffset + 1, startCol + colOffset + 1]
]

// Return a board of dimensions size x size with every tile initialised to EMPTY_VALUE
export function generateEmptyBoard(size: number) {
    const board = [];

    for (let row = 0; row < size; row++) {
        board.push([]);

        for (let col = 0; col < size; col++) {
            board[row].push(EMPTY_TILE);
        }
    }

    return board;
}

// Returns true if a board follows the rules of the N-Queens puzzle (i.e no queen is attacking any other queen)
export function isValidBoard(board: boolean[][]) {
    for (let row = 0; row < board.length; row++) {
        for (let col = 0; col < board.length; col++) {
            if (hasQueen(row, col, board) && !isValidPlacement(board, row, col)) {
                return false;
            }
        }
    }

    return true;
}

// Return true if a coordinate lies within the bounds of the board 
export function isOnBoard(row: number, col: number, board: boolean[][]) {
    return row >= 0 && row < board.length && col >= 0 && col < board.length;
}

// Return true if a given tile has a queen in it
export function hasQueen(row: number, col: number, board: boolean[][]) {
    return board[row][col] !== EMPTY_TILE;
}

// Return true if a placement in some coordinate satisfies the rules of the puzzle (i.e no queen is attacking any other queen)
export function isValidPlacement(board: boolean[][], rowPlacedAt: number, colPlacedAt: number) {
    for (let row = 0; row < board.length; row++) {
        if (row !== rowPlacedAt && hasQueen(row, colPlacedAt, board)) {
            return false;
        }

        if (hasDiagonallyAttackingQueen(rowPlacedAt, row, colPlacedAt, row, board)) {
            return false;
        }
    }

    return true;
}

// Return true if there exists a queen that is attacking this tile from a diagonal direction
function hasDiagonallyAttackingQueen(startRow: number, rowoffset: number, startCol: number, colOffset: number, board: boolean[][]) {
    return diagonalDirections.some(getResultingCoord => {
        const [resultingRow, resultingCol] = getResultingCoord(startRow, rowoffset, startCol, colOffset);

        return isOnBoard(resultingRow, resultingCol, board) && hasQueen(resultingRow, resultingCol, board);
    });
}
