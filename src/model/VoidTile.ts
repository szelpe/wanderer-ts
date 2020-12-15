import { Tile } from "./Tile";


export class VoidTile extends Tile {
    isWalkable = false;

    left = this;
    right = this;
    upper = this;
    lower = this;
}
