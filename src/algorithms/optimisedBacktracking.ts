import { AnimationFrame, newAnimationFrame } from "../animation";
import { EMPTY_TILE, isValidBoard, isValidPlacement } from "../board";
import { deepCopy, naturalNumberSetUntilN } from "../utils";

// Driver function for the optimised backtracking solver
export function optimisedBacktracking(board: boolean[][]) {
    const animationFrames = [];
    const domains = setDefaultDomains(new Map<number, Set<number>>(), board.length);

    backtrackingRecurse(board, naturalNumberSetUntilN(board.length), domains, animationFrames);

    return animationFrames;
}

function backtrackingRecurse(board: boolean[][], unplacedRows: Set<number>, domains: Map<number, Set<number>>, animationFrames: AnimationFrame[]) {
    if (unplacedRows.size === 0) {
        animationFrames.push(newAnimationFrame(board, "Solution found!"));

        console.assert(isValidBoard(board));

        return true;
    }

    const rowToPlaceAt = rowWithSmallestDomain(unplacedRows, domains);
    const domainForRowToPlaceAt = Array.from(domains.get(rowToPlaceAt));

    animationFrames.push(newAnimationFrame(board, `Selecting most constrained row... ${rowToPlaceAt}`));
    unplacedRows.delete(rowToPlaceAt);

    if (domainForRowToPlaceAt.length === 0) {
        animationFrames.push(newAnimationFrame(board, "Domain for this row is empty!"));
    }

    for (let i = 0; i < domainForRowToPlaceAt.length; i++) {
        const col = domainForRowToPlaceAt[i];

        board[rowToPlaceAt][col] = true;
        animationFrames.push(newAnimationFrame(board, "Attempting to place queen..."));

        if (isValidPlacement(board, rowToPlaceAt, col)) {
            animationFrames.push(newAnimationFrame(board, "Placement is valid!"));
            pruneDomains(rowToPlaceAt, domains, board);
            animationFrames.push(newAnimationFrame(board, "Pruning domains of the other queens..."));

            if (backtrackingRecurse(board, unplacedRows, domains, animationFrames)) {
                return true;
            }

        } else {
            animationFrames.push(newAnimationFrame(board, "Placement is invalid, Try again!"));
        }

        board[rowToPlaceAt][col] = EMPTY_TILE;
        setDefaultDomains(domains, board.length);
    }

    animationFrames.push(newAnimationFrame(board, "No valid placement found, backtracking..."));
    unplacedRows.add(rowToPlaceAt);
}

// Given a list of unplaced rows and a mapping between rows and domains, return the row with the smallest domain
function rowWithSmallestDomain(unplacedRows: Set<number>, domains: Map<number, Set<number>>) {
    return Array.from(unplacedRows).reduce((rowWithSmallestDomain, currentRow) => {
        if (domains.get(currentRow).size < domains.get(rowWithSmallestDomain).size) {
            return currentRow;
        } else {
            return rowWithSmallestDomain;
        }
    });
}

// Given a row and a mapping between rows and domains, use that row to prune the domains of all the other rows
function pruneDomains(rowToPlaceAt: number, domains: Map<number, Set<number>>, board: boolean[][]) {
    Array.from(domains.keys()).forEach(row => {
        if (row !== rowToPlaceAt) {
            const domainToPrune = domains.get(row);

            domainToPrune.forEach(col => {
                if (!isValidPlacement(board, row, col)) {
                    domainToPrune.delete(col);
                }
            });
        }
    });

    return domains;
}

// Return the total size of each rows domain summed up
function totalDomainSize(domains: Map<number, Set<number>>) {
    let total = 0;

    Array.from(domains.values()).forEach(domain => {
        Array.from(domain).forEach(elem => {
            total += elem;
        });
    });

    return total;
}

// Reset the domains to their original values
function setDefaultDomains(domains: Map<number, Set<number>>, size: number) {
    for (let row = 0; row < size; row++) {
        domains.set(row, naturalNumberSetUntilN(size));
    }

    return domains;
}

// Return a comparator that orders based on the domain size after making an assignment at some position
function getLeastConstrainingValueComparator(rowToPlaceAt: number, domains: Map<number, Set<number>>, board: boolean[][]) {
    return (col1: number, col2: number) =>
        getDomainSizeAfterPrune(rowToPlaceAt, col2, domains, board) - getDomainSizeAfterPrune(rowToPlaceAt, col1, domains, board)
}

// Return the new total size of the domains after making an assignment at (rowToPlaceAt, colToPlaceAt) and pruning
function getDomainSizeAfterPrune(rowToPlaceAt: number, colToPlaceAt: number, domainsArg: Map<number, Set<number>>, boardArg: boolean[][]) {
    const board = deepCopy(boardArg);
    const domains = new Map<number, Set<number>>(domainsArg);

    board[rowToPlaceAt][colToPlaceAt] = true;

    return totalDomainSize(pruneDomains(rowToPlaceAt, domains, board));
}

