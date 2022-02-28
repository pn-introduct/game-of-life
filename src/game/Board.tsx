import React, { useRef } from 'react';

const WIDTH = Number(process.env.REACT_APP_WIDTH);
const HEIGHT = Number(process.env.REACT_APP_HEIGHT);
const CELL_SIZE = Number(process.env.REACT_APP_CELL_SIZE);

type BoardType = boolean[][];

interface Props {
    children: React.ReactNode;
    board: BoardType;
    cols: number;
    rows: number;
    onClick: (board: BoardType) => void;
}


export const Board = ({board, children, cols, rows, onClick}: Props) => {
    const boardRef = useRef<HTMLDivElement>(null);

    function getElementOffset() {
        const {left, top} = boardRef?.current?.getBoundingClientRect() as DOMRect;
        const {clientLeft, clientTop} = document.documentElement;
        const {pageXOffset, pageYOffset} = window;
        return {
            x: (left + pageXOffset) - clientLeft,
            y: (top + pageYOffset) - clientTop,
        };
    }

    const handleClick = (event: React.MouseEvent) => {
        const newBoard: BoardType = [...board];
        const elemOffset = getElementOffset();
        const offsetX = event.clientX - elemOffset.x;
        const offsetY = event.clientY - elemOffset.y;

        const x = Math.floor(offsetX / CELL_SIZE);
        const y = Math.floor(offsetY / CELL_SIZE);

        if (x >= 0 && x <= cols && y >= 0 && y <= rows) {
            newBoard[y][x] = !board[y][x];

        }
        onClick(newBoard);
    }
    return (
        <div className="board"
             style={{ width: WIDTH, height: HEIGHT, backgroundSize: `${CELL_SIZE}px ${CELL_SIZE}px`}}
             onClick={handleClick}
             ref={boardRef}>

            {children}
        </div>
    )
}
