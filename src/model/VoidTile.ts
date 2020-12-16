import { Tile } from "./Tile";


export class VoidTile extends Tile {
    isWalkable = false;


    constructor() {
        super(null!, null!);
    }
}
