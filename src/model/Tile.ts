import { GameObject } from "./GameObject";
import { Direction } from "./Direction";

export class Tile extends GameObject {
    isWalkable = true;
    neighbors = new Map<Direction, Tile>();

    constructor(x: number, y: number) {
        super(x, y);
    }

    addNeightbor(direction: Direction, neighbor: Tile) {
        this.neighbors.set(direction, neighbor);
    }

    getNeighbor(direction: Direction) {
        return this.neighbors.get(direction);
    }
}


export class Floor extends Tile {
    isHighlighted = false;
}
export class Wall extends Tile {
    isWalkable = false;
}
