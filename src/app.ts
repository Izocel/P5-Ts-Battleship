import P5, { Color, Vector } from "p5";
import "p5/lib/addons/p5.dom";
import "p5/lib/addons/p5.sound";
import "./styles.scss";

const size = 64+16;
const radius = 1;
const space = 8;
const middleSpacer = 50;

const nbCol = 10;
const nbRow = 10;
const width = size * nbCol;
const height = size * nbRow;

const shipNames = [
	"Carrier",
	"battle",
	"Cruiser",
	"Submarine",
	"Destroyer"
];

const shipColors = {
	Carrier: {
		stroke: () => p5.stroke('black'),
		fill: () => p5.fill('MediumSeaGreen')
	},
	battle: {
		stroke: () => p5.stroke('black'),
		fill: () => p5.fill('SlateBlue')
	},
	Cruiser: {
		stroke: () => p5.stroke('black'),
		fill: () => p5.fill('Orange')
	},
	Submarine: {
		stroke: () => p5.stroke('black'),
		fill: () => p5.fill('Gray')
	},
	Destroyer: {
		stroke: () => p5.stroke('black'),
		fill: () => p5.fill('Tomato')
	}
};

function getRndInArray(list: any): any {
	return list[Math.floor((Math.random() * list.length))];
}

class MyVect extends P5.Vector {
	public orientation?: string;
	public fillColor?:string;
	public strokeColor?:string;
	public isMouseHover?:boolean;
}

class IsoGrid {
	private p5:P5;
	public type: string;
	public points:MyVect[];
	public hoverFillColor:string;
	public hoverStrokeColor?:string;
	public fillColor:string = "white";
	public strokeColor:string = "black";
	public mouseVect:unknown|MyVect;

	constructor(p5:P5) {
		this.p5 = p5;
		this.points = [];
	}

	setupIsoGrid(start: Vector = new Vector()): MyVect[] {
		for (let y = size / 2; y < height; y += size / 2) {
			let x = ((y) % (size) == 0) ? size : size / 2;
			let firstInRow = true;
			for (; x < width; x += size) {
				let p: MyVect = p5.createVector(x, y + start.y, 1);
				p.orientation = getRndInArray(["dUp", "dDown"]);
				if (firstInRow) {
					//first point in a row cannot be dUp oriented
					firstInRow = false;
					p.orientation = "dDown";
				}
				p.isMouseHover = false;
				this.points.push(p);
			}
	
			//last point in a row cannot be dDown oriented
			this.points[this.points.length - 1].orientation = "dUp";
		}
	
		return this.points;
	}
	
	drawIsoGrid() {
		this.points.forEach((p:MyVect, i) => {
			p.isMouseHover = this.mouseVect == p;
			const fill = p.isMouseHover ? this.hoverFillColor : this.fillColor;
			const stroke = p.isMouseHover ? this.hoverStrokeColor : this.strokeColor;
			p5.fill(fill);
			p5.stroke(stroke);
	
			p5.beginShape();
			p5.vertex(p.x - size / 2, p.y);
			p5.vertex(p.x, p.y - size / 2);
			p5.vertex(p.x + size / 2, p.y);
			p5.vertex(p.x, p.y + size / 2);
			p5.endShape(p5.CLOSE);
		});
	
		// Extras
		this.points.forEach((p, i) => {
			//center
			p5.fill('white');
			p5.ellipse(p.x, p.y, 16, 16);
	
			//index
			p5.fill(0, 0, 0);
			p5.text(i, p.x - 6, p.y + 20);
		});
	
		p5.noFill();
		p5.noStroke();
	}
}

/**
 * TODO:Carrier (5), 
 * TODO:Battleship (4),
 * TODO:Cruiser (3),
 * TODO:Submarine (3),
 * TODO:Destroyer (2)  
 */
class Ship extends MyVect {
	grid:IsoGrid = defenseGrid;
	gridIndex:number;
	maxHp:number = 2;
	hp:number = this.maxHp;
	name:string = "Destroyer";
	colors = shipColors[this.name];

	//draw colords rects
	draw(ship:Ship) {
		let p = this.grid.points[this.gridIndex];

		if(!p) {
			this.gridIndex = 0;
			p = this.grid.points[this.gridIndex];
		}

		let quad = [];
		if (this.orientation == "dDown") {
			quad.push(p5.createVector(p.x - size / 2 + space, p.y));
			quad.push(p5.createVector(p.x, p.y - size / 2 + space));
			quad.push(p5.createVector(p.x + size - space, p.y + size / 2));
			quad.push(p5.createVector(p.x + size / 2, p.y + size - space));
		}
		else if (this.orientation == "dUp") {
			quad.push(p5.createVector(p.x - size + space, p.y + size / 2));
			quad.push(p5.createVector(p.x, p.y - size / 2 + space));
			quad.push(p5.createVector(p.x + size / 2 - space, p.y));
			quad.push(p5.createVector(p.x - size / 2, p.y + size - space));
		}
		else if (this.orientation == "side") {
			quad.push(p5.createVector(p.x - space, p.y - size/4 - space/2));
			quad.push(p5.createVector(p.x + size + space, p.y - size/4 - space/2));

			quad.push(p5.createVector(p.x + size + space, p.y + size/4 + space/2));
			quad.push(p5.createVector(p.x - space, p.y + size/4 + space/2));
		}
		else if (this.orientation == "bottom") {
			quad.push(p5.createVector(p.x + size/2 - space*2, p.y - size/4 + space));
			quad.push(p5.createVector(p.x - size/2 + space*2, p.y - size/4 + space));

			quad.push(p5.createVector(p.x - size/2 + space*2, p.y + size + space));
			quad.push(p5.createVector(p.x + size/2 - space*2, p.y + size + space));
		}
		
		this.colors.fill();
		this.colors.stroke();
		drawRoundedPolygon(quad, radius);
	}
}


function windowResized() {
	p5.resizeCanvas(canvaWidth, canvaHeight);
}

function convertToClosed(points, radius) {
	// this value *actually* depends on the angle between the lines.
	// a 180 degree angle means f can be 1, a 10 degree angle needs
	// an f closer to 4!
	const f = 2.5;
	let closed = [];
	let p1, p2, p3, p2l, p2l_guide, p2r, p2r_guide, pc;
	let dx1, dy1, dx2, dy2, m;
	for (let i = 0, last = points.length; i < last; i++) { // >
		p1 = points[i];
		p2 = points[(i + 1) % last];
		p3 = points[(i + 2) % last];

		dx1 = p2.x - p1.x;
		dy1 = p2.y - p1.y;
		m = Math.sqrt(dx1 * dx1 + dy1 * dy1);
		p2l = p5.createVector(p2.x - radius * dx1 / m, p2.y - radius * dy1 / m);

		dx2 = p3.x - p2.x;
		dy2 = p3.y - p2.y;
		m = p5.sqrt(dx2 * dx2 + dy2 * dy2);
		p2r = p5.createVector(p2.x + radius * dx2 / m, p2.y + radius * dy2 / m);

		closed.push(p2l);
		closed.push(p2);
		closed.push(p2r);
	}
	return closed;
}

function roundIsosceles(p1, p2, p3, t) {
	let mt = 1 - t,
		c1x = (mt * p1.x + t * p2.x),
		c1y = (mt * p1.y + t * p2.y),
		c2x = (mt * p3.x + t * p2.x),
		c2y = (mt * p3.y + t * p2.y);
	return [c1x, c1y, c2x, c2y];
}

function drawRoundedPolygon(points, radius) {
	let closed = convertToClosed(points, radius);
	let p1, p2, p3;
	p5.beginShape();
	for (let i = 0, last = closed.length; i < last; i += 3) { //>
		p1 = closed[i];
		p2 = closed[i + 1];
		p3 = closed[i + 2];
		// rounded isosceles triangle connector values:
		let c = roundIsosceles(p1, p2, p3, 0.75);
		// tell Processing that we have points to add to our shape:
		p5.vertex(p1.x, p1.y);
		p5.bezierVertex(c[0], c[1], c[2], c[3], p3.x, p3.y);
	}
	
	p5.endShape(p5.CLOSE);
};

function getVectsFromMouse(grid:IsoGrid) {
	let mouseVect = new MyVect();
	mouseVect.x = Math.floor(p5.mouseX);
	mouseVect.y = Math.floor(p5.mouseY);

	const offset = 40;
	let vects = grid.points.filter(v => {return v.x-offset <= mouseVect.x && v.x+offset >= mouseVect.x 
		&& v.y-offset <= mouseVect.y && v.y+offset >= mouseVect.y});	
	
	let found = null;
	if(vects.length >= 0 && vects.length < 10) {
		const deltas = [];
		let foundI = 0;
		let minX = canvaWidth;
		for (let i = 0; i < vects.length; i++) {
			const v = vects[i];
			const deltaX = mouseVect.x-v.x;
			deltas.push(deltaX);

			let newMinX = Math.min(deltaX>= 0 ? deltaX : -deltaX, minX);
			if(newMinX !== minX) {
				minX = newMinX;
				foundI = i;
			}
			
		}

		found = vects[foundI];

		if(found) {
			grid.mouseVect = found;
			p5.mouseX = found.x
			p5.mouseY = found.y
		}
	}

	return found;
}

function mouseCursor() {
	p5.stroke('black');
	p5.fill('Tomato');
	p5.ellipse(p5.mouseX, p5.mouseY, 16,16);
	return p5.mouseY;
}

function gameLoop(p5:P5) {
	p5.clear();
	document.getElementById("app").style.cursor = "auto"
	attakGrid.drawIsoGrid();
	defenseGrid.drawIsoGrid();

	newShip.draw(newShip);
	newShip2.draw(newShip2);
	newShip3.draw(newShip3);
	newShip4.draw(newShip4);


	attakGrid.mouseVect = null;
	defenseGrid.mouseVect = null;
	
	let mouseGrid = null;
	if(p5.mouseY <= defenseGrid.points[0].y)
		mouseGrid = getVectsFromMouse(attakGrid);
	else
		mouseGrid = getVectsFromMouse(defenseGrid);

}


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


//Game Init
let canvaWidth = window.screen.width - 50;
let canvaHeight = window.screen.height - 50;
const p5 = new P5(sketch);

const scdStart = new Vector();
scdStart.y = size * nbRow + middleSpacer;

const attakGrid = new IsoGrid(p5);
attakGrid.type="attack";
attakGrid.setupIsoGrid();
attakGrid.hoverFillColor = "red";
attakGrid.hoverStrokeColor = "black"

const defenseGrid = new IsoGrid(p5);
defenseGrid.type="attack";
defenseGrid.setupIsoGrid(scdStart);
defenseGrid.hoverFillColor = "blue";
defenseGrid.hoverStrokeColor = "black"


const newShip = new Ship();
newShip.orientation = "dDown";
newShip.gridIndex = 0;

const newShip2 = new Ship();
newShip2.orientation = "dUp";
newShip2.gridIndex = 25;

const newShip3 = new Ship();
newShip3.orientation = "side";
newShip3.gridIndex = 50;

const newShip4 = new Ship();
newShip4.orientation = "bottom";
newShip4.gridIndex = 100;


window.setInterval(() => {
	newShip.gridIndex++;
	newShip2.gridIndex++;
	newShip3.gridIndex++;
	newShip4.gridIndex++;
},1000);


export default p5;