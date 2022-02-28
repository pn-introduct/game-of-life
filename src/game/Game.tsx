import React, { useEffect, useState } from 'react';
import { Cell, CellCoordinates } from './Cell';
import './Game.css';
import { Board } from './Board';

const WIDTH = Number(process.env.REACT_APP_WIDTH);
const HEIGHT = Number(process.env.REACT_APP_HEIGHT);
const CELL_SIZE = Number(process.env.REACT_APP_CELL_SIZE);


type BoardType = boolean[][];

export const Game = () => {
    const rows: number = HEIGHT / CELL_SIZE;
    const cols: number = WIDTH / CELL_SIZE;

    const [isRunning, setRunning] = useState<boolean>(false);
    const [interval, setInterval] = useState<number>(100);
    const [iteration, setIteration] = useState<number>(0);

    const [cells, setCells] = useState<CellCoordinates[]>([]);
    const [board, setBoard] = useState<BoardType>(makeEmptyBoard());

    let timeoutHandler: number = 0;

    useEffect(() => {
        if (isRunning) {
            runIteration();
        }
    }, [isRunning, iteration]);

    function makeEmptyBoard() {
        let board: BoardType = [];
        for (let y = 0; y < rows; y++) {
            board[y] = [];
            for (let x = 0; x < cols; x++) {
                board[y][x] = false;
            }
        }
        return board;
    }

    function makeCells(board: BoardType): CellCoordinates[] {
        const cells: CellCoordinates[] = [];
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                if (board[y][x]) {
                    cells.push({ x, y });
                }
            }
        }
        return cells
    }

    function runIteration() {
        let newBoard = makeEmptyBoard();
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                let neighbors = calculateNeighbors(board, x, y);
                if (board[y][x]) {
                    newBoard[y][x] = neighbors === 2 || neighbors === 3;
                } else {
                    if (!board[y][x] && neighbors === 3) {
                        newBoard[y][x] = true;
                    }
                }
            }
        }
        update(newBoard);

        timeoutHandler = window.setTimeout(
            () => setIteration(iteration + 1),
            interval
        );
    }

    function calculateNeighbors(board: BoardType, x: number, y: number) {
        let neighbors = 0;
        const dirs = [[-1, -1], [-1, 0], [-1, 1], [0, 1], [1, 1], [1, 0], [1, -1], [0, -1]];
        for (let i = 0; i < dirs.length; i++) {
            const dir = dirs[i];
            let y1 = y + dir[0];
            let x1 = x + dir[1];

            if (x1 >= 0 && x1 < cols && y1 >= 0 && y1 < rows && board[y1][x1]) {
                neighbors++;
            }
        }
        return neighbors;
    }

    function update(board: BoardType) {
        setBoard(board);
        setCells(makeCells(board));
    }

    const runGame = () => {
        setRunning(true);
        runIteration();
    }

    const stopGame = () => {
        setRunning(false);
        window.clearTimeout(timeoutHandler);
    }

    const handleClear = () => {
        const board = makeEmptyBoard();
        update(board);
    }

    const handleRandom = () => {
        const board: BoardType = makeEmptyBoard();
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                board[y][x] = (Math.random() >= 0.5);
            }
        }
        update(board);
    }

    return (
        <div>
            <div className="controls">
                Update every <input type='number' value={interval} onChange={({target}: React.ChangeEvent<HTMLInputElement>) => setInterval(+target.value)} /> ms
                {isRunning ?
                    <button className="button" onClick={stopGame}>Stop</button> :
                    <button className="button" onClick={runGame}>Run</button>
                }
                <button className="button" onClick={handleRandom}>Random</button>
                <button className="button" onClick={handleClear}>Clear</button>
            </div>

            <Board board={board} cols={cols} rows={rows} onClick={update}>
                {cells.map(({x, y}) => (
                    <Cell x={x} y={y} key={`${x},${y}`} />
                ))}
            </Board>
        </div>
    )
}
