import { GameObject } from "./GameObject";

export class Tile extends GameObject {
    isWalkable = true;

    upper: Tile;
    lower: Tile;
    left: Tile;
    right: Tile;

    constructor(x: number, y: number) {
        super(x, y);
    }
}


export class Floor extends Tile {
    isHighlighted = false;
}
export class Wall extends Tile {
    isWalkable = false;
}
