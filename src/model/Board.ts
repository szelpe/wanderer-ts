import { Level } from "./Level";
import { Tile } from "./Tile";
import { VoidTile } from "./VoidTile";

export class Board {
    private tileMap: Tile[][];
    private level = new Level();

    constructor(private columnCount: number, private rowCount: number) {
        this.tileMap = [];
    }

    setup() {
        for (let i = 0; i < this.rowCount; i++) {
            this.tileMap[i] = []
            for (let j = 0; j < this.columnCount; j++) {
                this.tileMap[i][j] = this.level.getTile(j, i);
            }
        }
        this.setNeighbors();
    }

    setNeighbors() {
        this.forEachTile((tile, x, y) => {
            tile.left = this.getTile(x - 1, y);
            tile.right = this.getTile(x + 1, y);
            tile.upper = this.getTile(x, y - 1);
            tile.lower = this.getTile(x, y + 1);
        });
    }

    *tiles() {
        for (let i = 0; i < this.rowCount; i++) {
            for (let j = 0; j < this.columnCount; j++) {
                yield this.tileMap[i][j];
            }
        }
    }

    forEachTile(cb: (tile: Tile, x: number, y: number) => void) {
        for (let i = 0; i < this.rowCount; i++) {
            for (let j = 0; j < this.columnCount; j++) {
                cb(this.tileMap[i][j], j, i);
            }
        }
    }

    getTile(x: number, y: number) {
        if (x < 0 || x > this.columnCount - 1) return new VoidTile();
        if (y < 0 || y > this.columnCount - 1) return new VoidTile();

        return this.tileMap[y][x];
    }
}
