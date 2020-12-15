import { GameObject } from "./GameObject";
import { Movement } from "./Movement";
import { Tile } from "./Tile";

export enum Direction {
    Up,
    Down,
    Left,
    Right
}

export class Hero extends GameObject {
    movement?: Movement;
    direction = Direction.Down;

    constructor(x: number, y: number, public currentTile: Tile) {
        super(x, y);
    }

    moveRight() {
        this.direction = Direction.Right;
        if (!this.currentTile.right.isWalkable) return;

        this.x++;
        this.currentTile = this.currentTile.right;
    }

    moveLeft() {
        this.direction = Direction.Left;
        if (!this.currentTile.left.isWalkable) return;

        this.x--;
        this.currentTile = this.currentTile.left;
    }

    moveUp() {
        this.direction = Direction.Up;
        if (!this.currentTile.upper.isWalkable) return;

        this.y--;
        this.currentTile = this.currentTile.upper;
    }

    moveDown() {
        this.direction = Direction.Down;
        if (!this.currentTile.lower.isWalkable) return;

        this.y++;
        this.currentTile = this.currentTile.lower;
    }

    update() {
        if (this.movement == null) return;

        let nextTile = this.movement.next();

        if (nextTile == null) {
            this.movement = null;
            return null;
        }

        if (nextTile == this.currentTile.upper) {
            this.moveUp();
        }
        if (nextTile == this.currentTile.lower) {
            this.moveDown();
        }
        if (nextTile == this.currentTile.left) {
            this.moveLeft();
        }
        if (nextTile == this.currentTile.right) {
            this.moveRight();
        }
    }
}
