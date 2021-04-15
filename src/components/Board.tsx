import React from "react";
import { Tile } from "./Tile";

interface Props {
    board: boolean[][]
    domain: number[]
    rowToPlaceAt: number
}

export const Board = ({ board, domain, rowToPlaceAt }: Props) => {
    // Render the size of a tile dynamically depending on the number of tiles in the board and the size of the screen
    const tileScreenSize = Math.min(window.innerHeight, window.innerWidth) / board.length / 1.8;

    function renderRow(row: boolean[], rowIndex: number) {
        return (
            <tr className="row" key={rowIndex}>
                {row.map((isQueen, colIndex) =>
                    <Tile row={rowIndex}
                        col={colIndex}
                        isQueen={isQueen}
                        isInDomain={rowIndex === rowToPlaceAt && domain.includes(colIndex)}
                        key={`${rowIndex}, ${colIndex}`}
                        screenSize={tileScreenSize} />
                )}
            </tr>
        );
    }

    return (
        <>
            <table id="board">
                <tbody>
                    {board.map((row, index) => renderRow(row, index))}
                </tbody>
            </table>
        </>
    );
}