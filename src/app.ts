import P5, { Vector } from "p5";
import "p5/lib/addons/p5.dom";
import "p5/lib/addons/p5.sound";
import "./SCSS/styles.scss";

import IsoGrid from "./Class/IsoGrid";
import Ship from "./Class/Ship";

import { getVectsFromMouse } from "./Utils/utils";
import { MIDDLESPACER } from "./Constants/constants";
import MyVect from "./Class/MyVect";
import GridPaterns from "./Class/GridPaterns";
import GameConsole from "./Class/GameConsole";

let gameConsole: GameConsole = null;

// Creating the sketch itself
function sketch(p5: P5) {
	p5.setup = () => {
		const cnv = p5.createCanvas(canvaWidth, canvaHeight);
		cnv.style('display', 'block');
		cnv.parent('app');

		gameConsole = new GameConsole("gameConsole");

		// The game loop
		p5.draw = () => {
			p5.clear();
			gameLoop(p5);
		};
	}
}

function gameLoop(p5: P5) {
	p5.mousePressed = null;
	attakGrid.drawIsoGrid();
	defenseGrid.drawIsoGrid();

	let mouseGrid: MyVect = null;
	let mouseGridIdx: number = null;
	attakGrid.mouseVect = null;
	defenseGrid.mouseVect = null;
	if (p5.mouseY <= defenseGrid.points[0].y) {
		mouseGrid = getVectsFromMouse(attakGrid);
		mouseGridIdx = attakGrid.points.findIndex(v => v == mouseGrid);
	}
	else {
		mouseGrid = getVectsFromMouse(defenseGrid);
		mouseGridIdx = attakGrid.points.findIndex(v => v == mouseGrid);
	}

	const selectedAction = true;
	let atkSelectors = null;
	if (selectedAction && mouseGridIdx > 0) {
		atkSelectors = gridPaterns.getCross(3, mouseGridIdx);

		if (gridPaterns.areInGrid(atkSelectors))
			attakGrid.fillGridIndexes(atkSelectors)
	}


	Carrier.draw();
	Battleship.draw();
	Cruiser.draw();
	Submarine.draw();
	Destroyer.draw();

	attakGrid.setGridPin();
	defenseGrid.setGridPin();

	if (atkSelectors) {
		p5.mousePressed = (e) => onClickAttack(e, atkSelectors);
	}

	attakGrid.drawGridPin();
	defenseGrid.drawGridPin();
}

// Game Init
const nbColRow = 10;
let canvaWidth = Math.floor(window.screen.width);
let canvaHeight = Math.floor(window.screen.height);
let calcHeight = Math.floor(canvaHeight / (nbColRow * 3));

const p5 = new P5(sketch);

// Player Init
let selectedAtkMode = "attack";

function onClickAttack(e: object, mouseAtkGrids: number[]) {
	const hitIdx: number[] = [];
	gameConsole.log(`Fires at(${mouseAtkGrids})`);
	
	mouseAtkGrids.forEach(idx => {
		const point = attakGrid.points[idx];
		
		if (defenseGrid.shipAtIndex(idx)) {
			point.pinColor = "green";
			hitIdx.push(idx);
		}
	});
	
	if (hitIdx.length)
		gameConsole.succes(`Successfull hits(${hitIdx})`);

	return attakGrid
}

function setAttackVectors(e: Event, mode: string) {
	selectedAtkMode = mode;
}

// Grids Init
const attakGrid = new IsoGrid(p5, 'attack');
attakGrid.nbCol = nbColRow;
attakGrid.nbRow = nbColRow;
attakGrid.size = calcHeight;
attakGrid.height = attakGrid.nbCol * attakGrid.size;
attakGrid.width = attakGrid.nbRow * attakGrid.size;
attakGrid.setupIsoGrid();

const defenseGrid = new IsoGrid(p5, 'defense');
defenseGrid.nbCol = nbColRow;
defenseGrid.nbRow = nbColRow;
defenseGrid.size = calcHeight;
defenseGrid.height = defenseGrid.nbCol * defenseGrid.size;
defenseGrid.width = defenseGrid.nbRow * defenseGrid.size;

const defGridStart = new Vector();
defGridStart.y = attakGrid.size * attakGrid.nbCol + MIDDLESPACER;
defenseGrid.setupIsoGrid(defGridStart);

const Carrier = new Ship("Carrier", 5, defenseGrid);
Carrier.orientation = "dDown";
Carrier.gridIndex[0] = 33;

const Battleship = new Ship("Battleship", 4, defenseGrid);
Battleship.orientation = "dUp";
Battleship.gridIndex[0] = 34;

const Cruiser = new Ship("Cruiser", 3, defenseGrid);
Cruiser.orientation = "side";
Cruiser.gridIndex[0] = 50;

const Submarine = new Ship("Submarine", 3, defenseGrid);
Submarine.orientation = "bottom";
Submarine.gridIndex[0] = 100;

const Destroyer = new Ship("Destroyer", 2, defenseGrid);
Destroyer.orientation = "dUp";
Destroyer.gridIndex[0] = 125;

let pIndex = 0;
window.setInterval(() => {
	// Carrier.gridIndex[0]++;
	// Battleship.gridIndex[0]++;
	// Cruiser.gridIndex[0]++;
	// Submarine.gridIndex[0]++;
	// Destroyer.gridIndex[0]++;

	if (Carrier.gridIndex[0] > 180)
		Carrier.gridIndex[0] = 0;
	if (Carrier.gridIndex[0] < 0)
		Carrier.gridIndex[0] = 180;

	if (Battleship.gridIndex[0] > 180)
		Battleship.gridIndex[0] = 0;
	if (Battleship.gridIndex[0] < 0)
		Battleship.gridIndex[0] = 180;

	if (Cruiser.gridIndex[0] > 180)
		Cruiser.gridIndex[0] = 0;
	if (Cruiser.gridIndex[0] < 0)
		Cruiser.gridIndex[0] = 180;

	if (Submarine.gridIndex[0] > 180)
		Submarine.gridIndex[0] = 0;
	if (Submarine.gridIndex[0] < 0)
		Submarine.gridIndex[0] = 180;

	if (Destroyer.gridIndex[0] > 180)
		Destroyer.gridIndex[0] = 0;
	if (Destroyer.gridIndex[0] < 0)
		Destroyer.gridIndex[0] = 180;
}, 750);

export {
	attakGrid,
	defenseGrid
};


const gridPaterns = new GridPaterns(p5, attakGrid);
const patternsList = {
	line1: gridPaterns.getLine(1, 80),
	line2: gridPaterns.getLine(2, 80),
	line3: gridPaterns.getLine(3, 80),

	sqr2: gridPaterns.getSquare(2, 80),
	sqr3: gridPaterns.getSquare(3, 80),

	cross3: gridPaterns.getCross(3, 80),
};

console.log(attakGrid)
console.log(defenseGrid)
console.log(gridPaterns);

export default p5;


