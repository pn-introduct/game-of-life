export interface CellCoordinates {
    x: number;
    y: number;
}

interface Props {
    coordinates: CellCoordinates;
    cellSize: number;
}

export const Cell = ({coordinates: {x, y}, cellSize}: Props) =>
    <div className="cell" style={{
        left: `${cellSize * x + 1}px`,
        top: `${cellSize * y + 1}px`,
        width: `${cellSize - 1}px`,
        height: `${cellSize - 1}px`,
    }} />

