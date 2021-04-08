import React from "react";

interface Props {
    isQueen: boolean
    row: number
    col: number
    screenSize: number
}

export const Tile = ({ isQueen, row, col, screenSize }: Props) => {
    const tileBackgroundColor = getColorFromPos(row, col);

    const queenJSX = (
        <>
            <img className="queen-image" src="assets/queen.svg"></img>
            <p className="queen-number">{row}</p>
        </>
    );

    const emptyJSX = <> </>;

    function getColorFromPos(row: number, col: number) {
        if (row % 2 === col % 2) {
            return "white";
        } else {
            return "gainsboro";
        }
    }

    return (
        <td className="tile" style={{ backgroundColor: tileBackgroundColor, height: screenSize, width: screenSize }}>
            {isQueen ? queenJSX : emptyJSX}
        </td >
    );
}

