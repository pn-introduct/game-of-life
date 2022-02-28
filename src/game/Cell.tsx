export interface CellCoordinates {
    x: number;
    y: number;
}

const CELL_SIZE = Number(process.env.REACT_APP_CELL_SIZE);

export const Cell = ({x, y}: CellCoordinates) =>
    <div className="cell" style={{
        left: `${CELL_SIZE * x + 1}px`,
        top: `${CELL_SIZE * y + 1}px`,
        width: `${CELL_SIZE - 1}px`,
        height: `${CELL_SIZE - 1}px`,
    }} />

