import P5, { Vector } from "p5";
import "p5/lib/addons/p5.dom";
import "p5/lib/addons/p5.sound";
import "./SCSS/styles.scss";

import IsoGrid from "./IsoGrid";
import { getVectsFromMouse } from "./utils";
import Ship from "./Ship";
import { MIDDLESPACER } from "./constants";

// Creating the sketch itself
function sketch(p5: P5) {
	p5.setup = () => {
		const cnv = p5.createCanvas(canvaWidth, canvaHeight);
		cnv.style('display', 'block');
		cnv.parent('app');

		// The game loop
		p5.draw = () => {
			gameLoop(p5);
		};
	}
}

function gameLoop(p5: P5) {
	p5.clear();
	document.getElementById("app").style.cursor = "auto"
	attakGrid.drawIsoGrid();
	defenseGrid.drawIsoGrid();

	Carrier.draw();
	Battleship.draw();
	Cruiser.draw();
	Submarine.draw();
	Destroyer.draw();

	attakGrid.mouseVect = null;
	defenseGrid.mouseVect = null;

	let mouseGrid = null;
	if (p5.mouseY <= defenseGrid.points[0].y)
		mouseGrid = getVectsFromMouse(attakGrid);
	else
		mouseGrid = getVectsFromMouse(defenseGrid);

}

//Game Init
let canvaWidth = window.screen.width - 50;
let canvaHeight = window.screen.height - 50;
const p5 = new P5(sketch);

const attakGrid = new IsoGrid(p5);
attakGrid.nbCol = 10;
attakGrid.nbRow = 10;
attakGrid.padding = 8;
attakGrid.size = 64 + 16;
attakGrid.height = attakGrid.nbCol * attakGrid.size;
attakGrid.width = attakGrid.nbRow * attakGrid.size;

attakGrid.type = "attack";
attakGrid.setupIsoGrid();
attakGrid.hoverFillColor = "red";
attakGrid.hoverStrokeColor = "black"

const defenseGrid = new IsoGrid(p5);
defenseGrid.nbCol = 10;
defenseGrid.nbRow = 10;
defenseGrid.padding = 8;
defenseGrid.size = 64 + 16;
defenseGrid.height = defenseGrid.nbCol * defenseGrid.size;
defenseGrid.width = defenseGrid.nbRow * defenseGrid.size;

defenseGrid.type = "defense";
const defGridStart = new Vector();
defGridStart.y = attakGrid.size * attakGrid.nbCol + MIDDLESPACER;
defenseGrid.setupIsoGrid(defGridStart);
defenseGrid.hoverFillColor = "blue";
defenseGrid.hoverStrokeColor = "black"

const Carrier = new Ship("Carrier", 5, defenseGrid);
Carrier.orientation = "dDown";
Carrier.gridStart = 33;

const Battleship = new Ship("Battleship", 4, defenseGrid);
Battleship.orientation = "dUp";
Battleship.gridStart = 34;

const Cruiser = new Ship("Cruiser", 3, defenseGrid);
Cruiser.orientation = "side";
Cruiser.gridStart = 50;

const Submarine = new Ship("Submarine", 3, defenseGrid);
Submarine.orientation = "bottom";
Submarine.gridStart = 100;

const Destroyer = new Ship("Destroyer", 2, defenseGrid);
Destroyer.orientation = "dUp";
Destroyer.gridStart = 125;

// window.setInterval(() => {
// 	Carrier.gridStart++;
// 	Battleship.gridStart++;
// 	Cruiser.gridStart++;
// 	Submarine.gridStart++;
// 	Destroyer.gridStart++;
// },1000);

export {
	attakGrid,
	defenseGrid
};

console.log(attakGrid)
console.log(defenseGrid)

export default p5;