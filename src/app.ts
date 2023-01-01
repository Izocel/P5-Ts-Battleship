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

// Creating the sketch itself
function sketch(p5: P5) {
	p5.setup = () => {
		const cnv = p5.createCanvas(canvaWidth * 2, canvaHeight * 2);
		cnv.style('display', 'block');
		cnv.parent('app');

		// The game loop
		p5.draw = () => {
			p5.clear();
			gameLoop(p5);
		};
	}
}

function gameLoop(p5: P5) {
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
	if (selectedAction && mouseGridIdx > 0) {
		const selectors = gridPaterns.getCross(3, mouseGridIdx);

		if (gridPaterns.areInGrid(selectors))
			attakGrid.fillGridIndexes(selectors)
	}


	Carrier.draw();
	Battleship.draw();
	Cruiser.draw();
	Submarine.draw();
	Destroyer.draw();

	attakGrid.drawGridPin()
	defenseGrid.drawGridPin()
}

//Game Init
let canvaWidth = window.screen.width;
let canvaHeight = window.screen.height;
const p5 = new P5(sketch);

const nbColRow = 10;
const padding = 8;
let calcHeight = 64 + 32;

const attakGrid = new IsoGrid(p5, 'attack');
attakGrid.nbCol = nbColRow;
attakGrid.nbRow = nbColRow;
attakGrid.padding = padding;
attakGrid.size = calcHeight;
attakGrid.height = attakGrid.nbCol * attakGrid.size;
attakGrid.width = attakGrid.nbRow * attakGrid.size;
attakGrid.setupIsoGrid();

const defenseGrid = new IsoGrid(p5, 'defense');
defenseGrid.nbCol = nbColRow;
defenseGrid.nbRow = nbColRow;
defenseGrid.padding = padding;
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
