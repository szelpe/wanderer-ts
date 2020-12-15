import { Tile } from "./Tile";


export class Movement {
    currentTile = 0;

    constructor(private tilesToMove: Tile[]) { }

    next() {
        if (this.currentTile >= this.tilesToMove.length)
            return null;

        return this.tilesToMove[this.currentTile++];
    }
}
