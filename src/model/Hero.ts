import { Direction } from "./Direction";
import { GameObject } from "./GameObject";
import { Movement } from "./Movement";
import { Tile } from "./Tile";

export class Hero extends GameObject {
    movement?: Movement;
    direction = Direction.Down;

    constructor(x: number, y: number, public currentTile: Tile) {
        super(x, y);
    }

    move(direction: Direction) {
        this.direction = direction;

        let nextTile = this.currentTile.getNeighbor(direction);

        if (!nextTile.isWalkable) return;
        this.currentTile = nextTile;
        this.x = nextTile.X;
        this.y = nextTile.Y;
    }

    update() {
        if (this.movement == null) return;

        let nextTile = this.movement.next();

        if (nextTile == null) {
            this.movement = null;
            return null;
        }

        Object.keys(Direction)
            .map(direction => Direction[direction])
            .filter(direction => this.currentTile.getNeighbor(direction) === nextTile)
            .forEach(direction => this.move(direction));
    }
}
