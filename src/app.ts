import P5, { Image, Vector } from "p5";
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
import SpriteJSON from "./Class/SpriteJSON";
import Sprite from "./Class/Sprite";

let shipsData: SpriteJSON;
let shipsSprites: P5.Image;
let shipsJsonData: object | any[];
let gameConsole: GameConsole = null;

let Carrier: Ship,
	CarrierAtk: Ship,
	Battleship: Ship,
	BattleshipAtk: Ship,
	Cruiser: Ship,
	CruiserAtk: Ship,
	Submarine: Ship,
	SubmarineAtk: Ship,
	Destroyer: Ship,
	DestroyerAtk: Ship;




// Creating the sketch itself
function sketch(p5: P5) {
	p5.angleMode(p5.DEGREES);

	p5.preload = () => {
		shipsJsonData = p5.loadJSON("./Ships/data.json");
		shipsSprites = p5.loadImage("./Ships/sprites.png");

		if (shipsJsonData && shipsSprites)
			document.getElementById("userUi").hidden = false;


		gameConsole = new GameConsole("gameConsole");

		Carrier = new Ship("Carrier", 5, defenseGrid);
		Carrier.orientation = "dDown";
		Carrier.gridIndex[0] = 33;

		CarrierAtk = new Ship("Carrier", 5, attakGrid);
		CarrierAtk.orientation = "dDown";
		CarrierAtk.gridIndex[0] = 33;

		Battleship = new Ship("Battleship", 4, defenseGrid);
		Battleship.orientation = "dUp";
		Battleship.gridIndex[0] = 34;

		BattleshipAtk = new Ship("Battleship", 4, attakGrid);
		BattleshipAtk.orientation = "dUp";
		BattleshipAtk.gridIndex[0] = 34;

		Cruiser = new Ship("Cruiser", 3, defenseGrid);
		Cruiser.orientation = "side";
		Cruiser.gridIndex[0] = 50;

		CruiserAtk = new Ship("Cruiser", 3, attakGrid);
		CruiserAtk.orientation = "side";
		CruiserAtk.gridIndex[0] = 50;

		Submarine = new Ship("Submarine", 3, defenseGrid);
		Submarine.orientation = "bottom";
		Submarine.gridIndex[0] = 100;

		SubmarineAtk = new Ship("Submarine", 3, attakGrid);
		SubmarineAtk.orientation = "bottom";
		SubmarineAtk.gridIndex[0] = 100;

		Destroyer = new Ship("Destroyer", 2, defenseGrid);
		Destroyer.orientation = "dUp";
		Destroyer.gridIndex[0] = 125;

		DestroyerAtk = new Ship("Destroyer", 2, attakGrid);
		DestroyerAtk.orientation = "dUp";
		DestroyerAtk.gridIndex[0] = 125;
	}

	p5.setup = () => {
		const cnv = p5.createCanvas(canvaWidth, canvaHeight);
		cnv.style('display', 'block');
		cnv.parent('app');

		shipsData = new SpriteJSON(shipsJsonData);

		const bA: Sprite = new Sprite().withSpriteJson(shipsData, shipsSprites, 0, 0);
		Carrier.setSprite(bA);
		CarrierAtk.setSprite(bA);

		const bB: Sprite = new Sprite().withSpriteJson(shipsData, shipsSprites, 1, 1);
		Battleship.setSprite(bB);
		BattleshipAtk.setSprite(bB);

		const bC: Sprite = new Sprite().withSpriteJson(shipsData, shipsSprites, 2, 2);
		Cruiser.setSprite(bC);
		CruiserAtk.setSprite(bC);

		const bD: Sprite = new Sprite().withSpriteJson(shipsData, shipsSprites, 3, 3);
		Submarine.setSprite(bD);
		SubmarineAtk.setSprite(bD);

		const bE: Sprite = new Sprite().withSpriteJson(shipsData, shipsSprites, 4, 4);
		Destroyer.setSprite(bE);
		DestroyerAtk.setSprite(bE);

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

	//TODO: Grid method
	Object.entries(defenseGrid.ships).forEach(s => {
		const ship: Ship = s[1];
		ship.draw();
	});

	Object.entries(attakGrid.ships).forEach(s => {
		const ship: Ship = s[1];
		ship?.draw();
	});

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
export default p5;


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


// Player Init
let selectedAtkMode = "attack";

// Grids Init
const attakGrid = new IsoGrid('attack');
attakGrid.nbCol = nbColRow;
attakGrid.nbRow = nbColRow;
attakGrid.size = calcHeight;
attakGrid.height = attakGrid.nbCol * attakGrid.size;
attakGrid.width = attakGrid.nbRow * attakGrid.size;
attakGrid.setupIsoGrid();

const defenseGrid = new IsoGrid('defense');
defenseGrid.nbCol = nbColRow;
defenseGrid.nbRow = nbColRow;
defenseGrid.size = calcHeight;
defenseGrid.height = defenseGrid.nbCol * defenseGrid.size;
defenseGrid.width = defenseGrid.nbRow * defenseGrid.size;

const defGridStart = new Vector();
defGridStart.y = attakGrid.size * attakGrid.nbCol + MIDDLESPACER;
defenseGrid.setupIsoGrid(defGridStart);


const gridPaterns = new GridPaterns(attakGrid);
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