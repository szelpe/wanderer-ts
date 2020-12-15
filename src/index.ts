import floor from '../img/floor.png';
import grass from '../img/grass.png';
import heroDown from '../img/hero-down.png';
import heroLeft from '../img/hero-left.png';
import heroUp from '../img/hero-up.png';
import heroRight from '../img/hero-right.png';
import pond from '../img/pond.png';
import wall from '../img/wall.png';
import { Board } from './model/Board';
import { GameObject } from './model/GameObject';
import { Direction, Hero } from './model/Hero';
import { Movement } from './model/Movement';
import { Floor, Tile, Wall } from './model/Tile';

let canvas = document.getElementById('game') as HTMLCanvasElement;
let ctx = canvas.getContext('2d');

// ctx.fillRect(100, 100, 30, 30);

let imageFileNames = {
    floor,
    grass,
    heroDown,
    heroUp,
    heroLeft,
    heroRight,
    pond,
    wall
};

let images = Object.fromEntries(
    Object.keys(imageFileNames).map(
        imageName => {
            let img = new Image(64, 64);
            img.src = imageFileNames[imageName];

            return [imageName, img];
        }
    )
)

Promise.all(
    Object.values(images)
        .map(img => new Promise(res => img.onload = res))
).then(() => {
    let game = new Game();

    game.draw();
});



class Game {
    board = new Board(10, 10);
    hero: Hero;
    static tileSize = 64;

    constructor() {
        this.board.setup();
        this.hero = new Hero(0, 0, this.board.getTile(0, 0));

        document.addEventListener('keydown', this.handleKeyDown.bind(this));
        document.addEventListener('click', this.handleClick.bind(this));
        setInterval(this.update.bind(this), 150);
    }

    draw() {
        this.board.forEachTile((tile) => {
            this.drawGameObject(tile);
        });
        this.drawGameObject(this.hero);
    }

    drawGameObject(gameObject: GameObject) {
        ctx.drawImage(this.getImageFor(gameObject), gameObject.X * Game.tileSize, gameObject.Y * Game.tileSize, Game.tileSize, Game.tileSize);
    }

    getImageFor(gameObject: GameObject) {
        if (gameObject instanceof Hero) {
            if(gameObject.direction === Direction.Down)
                return images.heroDown;
            if(gameObject.direction === Direction.Up)
                return images.heroUp;
            if(gameObject.direction === Direction.Left)
                return images.heroLeft;
            if(gameObject.direction === Direction.Right)
                return images.heroRight;
        }
        if (gameObject instanceof Floor) {
            if (gameObject.isHighlighted)
                return images.grass

            return images.floor;
        }
        if (gameObject instanceof Wall)
            return images.wall;
    }

    handleKeyDown(e: KeyboardEvent) {
        switch (e.key) {
            case "ArrowRight":
                this.hero.moveRight();
                break;
            case "ArrowLeft":
                this.hero.moveLeft();
                break;
            case "ArrowDown":
                this.hero.moveDown();
                break;
            case "ArrowUp":
                this.hero.moveUp();
                break;
        }

        this.draw();
    }

    directions = [
        { name: "down", dx: 0, dy: 1 },
        { name: "right", dx: 1, dy: 0 },
        { name: "up", dx: 0, dy: -1 },
        { name: "left", dx: -1, dy: 0 }
    ];

    async findPath(startField, endField, shortestPaths) {
        let fieldsToVisit = [];
        let fieldsVisited = [];

        fieldsToVisit.push(startField);

        while (fieldsToVisit.length > 0) {
            let field = fieldsToVisit.shift();
            if (fieldsVisited.includes(field)) continue;
            fieldsVisited.push(field);

            this.directions
                .map((direction) =>
                    this.board.getTile(field.X + direction.dx, field.Y + direction.dy)
                )
                .filter((f) => f != null)
                .filter((f) => f.isWalkable)
                .filter((f) => !fieldsVisited.includes(f))
                .forEach((f) => {
                    f.previous = field;

                    if (f === endField) {
                        saveFoundPath(f, startField, shortestPaths);
                    }

                    fieldsToVisit.push(f);
                });
        }

        function saveFoundPath(lastField, startField, shortestPaths) {
            let currentField = lastField;
            let path = [];

            while (currentField !== startField) {
                path.unshift(currentField);
                currentField = currentField.previous;
            }

            shortestPaths.push(path);
        }
    }


    handleClick(e) {
        let x = Math.floor(e.offsetX / Game.tileSize);
        let y = Math.floor(e.offsetY / Game.tileSize);

        resetColor.bind(this)();

        let startField = this.hero.currentTile;

        let endField = this.board.getTile(x, y);
        if (endField == null) return;

        var shortestPaths = [];

        this.findPath(startField, endField, shortestPaths);

        if (shortestPaths.length > 0) {
            this.hero.movement = new Movement(shortestPaths[0]);
        }

        this.draw();

        function colorPath(path: Floor[]) {
            path.forEach(tile => tile.isHighlighted = true);
        }

        function resetColor() {
            this.board.forEachTile(tile => tile.isHighlighted = false);
        }
    }

    update() {
        this.hero.update();

        this.draw();
    }
}

