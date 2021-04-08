import React from "react";
import { Tile } from "./Tile";

interface Props {
    board: boolean[][]
}

export const Board = ({ board }: Props) => {
    // Render the size of a tile dynamically depending on the number of tiles in the board and the size of the screen
    const tileScreenSize = Math.min(window.innerHeight, window.innerWidth) / board.length / 1.8;

    function renderRow(row: boolean[], rowIndex: number) {
        return (
            <tr className="row" key={rowIndex}>
                {row.map((isQueen, colIndex) =>
                    <Tile row={rowIndex} col={colIndex} isQueen={isQueen} key={`${rowIndex}, ${colIndex}`} screenSize={tileScreenSize} />
                )}
            </tr>
        );
    }

    return (
        <>
            <table id="grid">
                <tbody>
                    {board.map((row, index) => renderRow(row, index))}
                </tbody>
            </table>
        </>
    );
}