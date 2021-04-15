import { AnimationFrame, newAnimationFrame } from "../animation";
import { EMPTY_TILE, isValidPlacement } from "../board";
import { deepCopy, naturalNumberListUntilN, naturalNumberSetUntilN } from "../utils";

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

        return true;
    }

    const rowToPlaceAt = rowWithSmallestDomain(unplacedRows, domains);
    const domainForRowToPlaceAt = Array.from(domains.get(rowToPlaceAt));

    animationFrames.push(newAnimationFrame(board, `Selecting most constrained row... ${rowToPlaceAt}`, domainForRowToPlaceAt, rowToPlaceAt));
    unplacedRows.delete(rowToPlaceAt);

    if (domainForRowToPlaceAt.length === 0) {
        animationFrames.push(newAnimationFrame(board, "This row has no available tiles!"));
    }

    for (let i = 0; i < domainForRowToPlaceAt.length; i++) {
        const col = domainForRowToPlaceAt[i];

        animationFrames.push(newAnimationFrame(board, "Placing queen...", domainForRowToPlaceAt, rowToPlaceAt));
        board[rowToPlaceAt][col] = true;
        animationFrames.push(newAnimationFrame(board, "Placing queen...", domainForRowToPlaceAt, rowToPlaceAt));

        pruneDomains(rowToPlaceAt, domains, board, animationFrames);

        if (backtrackingRecurse(board, unplacedRows, domains, animationFrames)) {
            return true;
        }

        animationFrames.push(newAnimationFrame(board, "Placements don't satisfy, reset available tiles..."));
        setDefaultDomains(domains, board.length);

        for (let row = 0; row < board.length; row++) {
            if (row !== rowToPlaceAt) {
                animationFrames.push(newAnimationFrame(board, `Resetting available tiles for row ${row}`, naturalNumberListUntilN(board.length), row));
            }
        }

        board[rowToPlaceAt][col] = EMPTY_TILE;
    }

    if (domainForRowToPlaceAt.length > 0) {
        animationFrames.push(newAnimationFrame(board, "No valid placement found, backtracking..."));
    }

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
function pruneDomains(rowToPlaceAt: number, domains: Map<number, Set<number>>, board: boolean[][], animationFrames: AnimationFrame[]) {
    Array.from(domains.keys()).forEach(row => {
        if (row !== rowToPlaceAt) {
            const domainToPrune = domains.get(row);

            animationFrames.push(newAnimationFrame(board, `Pruning available tiles of row ${row}...`, Array.from(domainToPrune), row));

            domainToPrune.forEach(col => {
                if (!isValidPlacement(board, row, col)) {
                    domainToPrune.delete(col);
                }
            });

            animationFrames.push(newAnimationFrame(board, `Pruning available tiles of row ${row}...`, Array.from(domainToPrune), row));
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

    return totalDomainSize(pruneDomains(rowToPlaceAt, domains, board, []));
}

