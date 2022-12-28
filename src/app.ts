import P5, { Vector } from "p5";
import "p5/lib/addons/p5.dom";
import "p5/lib/addons/p5.sound";
import "./styles.scss";

// // DEMO: A sample class implementation
// import MyCircle from "./MyCircle";

function get_random(list: any): any {
	return list[Math.floor((Math.random() * list.length))];
}

class MyVect extends P5.Vector {
	public orientation?: string = "none";
}

let points: MyVect[] = [];
let totalPerRow;

let canvaWidth = window.screen.width-50;
let canvaHeight = window.screen.height-50;

// Grid
const size = 100;
const radius = 1;
const space = 10;
const middleSpacer = 200;

const nbCol = 10;
const nbRow = 10;
const width = size*nbCol;
const height = size*nbRow;


function windowResized() {
	p5.resizeCanvas(canvaWidth, canvaHeight);
  }

// Creating the sketch itself
const sketch = (p5: P5) => {
	// The sketch setup method 
	p5.setup = () => {
		const cnv = p5.createCanvas(canvaWidth, canvaHeight);
		cnv.style('display', 'block');
		cnv.parent('app');
		
		//Game Init
		const newPoints:MyVect[] = setupIsoGrid(p5);
		drawIsoGrid(p5, newPoints);

		const scdStart = new Vector();
		scdStart.y = size*nbRow + middleSpacer;
		const newPoints2:MyVect[] = setupIsoGrid(p5, scdStart);
		drawIsoGrid(p5, newPoints2);

		// The game loop
		p5.draw = () => {
		};
	}
}

function setupIsoGrid(p5: P5, start:Vector = new Vector()):MyVect[] {
	let points:MyVect[] = [];
	for (let y = size / 2; y < height; y += size / 2) {
		let x = ((y) % (size) == 0) ? size : size / 2;
		let firstInRow = true;
		for (; x < width; x += size) {
			let p: MyVect = p5.createVector(x, y + start.y, 1);
			p.orientation = get_random(["left", "right"]);
			if (firstInRow) {
				//first point in a row cannot be left oriented
				firstInRow = false;
				p.orientation = "right";
			}
			points.push(p);
		}
		//last point in a row cannot be right oriented
		points[points.length - 1].orientation = "left";
		if (!totalPerRow) totalPerRow = points.length;
	}

	return points;
}

function drawIsoGrid(p5: P5, points:MyVect[]) {


	//draw grid
	points.forEach((p, i) => {
		p5.fill(255,255,255);
		p5.stroke(0,0,0);
		
		p5.beginShape();
		p5.vertex(p.x - size / 2, p.y);
		p5.vertex(p.x, p.y - size / 2);
		p5.vertex(p.x + size / 2, p.y);
		p5.vertex(p.x, p.y + size / 2);
		p5.endShape(p5.CLOSE);

		//center
		p5.ellipse(p.x, p.y, 12, 12);

		//index
		p5.fill(0,0,0);
		p5.text(i, p.x - 6, p.y + 20);
	});

	//draw rects
	p5.fill(255, 0, 0, 78);
	

	//TODO: This wil be codelike for boats or actioned grid indexes
	for (let t = 0; t < 100; t++) {
		let p = get_random(points);
		let i = points.indexOf(p);
		if (
			p.z == 1 && //enabled
			i < points.length - totalPerRow //not the last row
		) {
			p.z = 0;
			let quad = [];
			if (p.orientation == "right" && points[i + totalPerRow].z == 1) {
				points[i + totalPerRow].z = 0;
				quad.push(p5.createVector(p.x - size / 2 + space, p.y));
				quad.push(p5.createVector(p.x, p.y - size / 2 + space));
				quad.push(p5.createVector(p.x + size - space, p.y + size / 2));
				quad.push(p5.createVector(p.x + size / 2, p.y + size - space));
			}
			else if (p.orientation == "left" && points[i + totalPerRow - 1].z == 1) {
				points[i + totalPerRow - 1].z = 0;
				quad.push(p5.createVector(p.x - size + space, p.y + size / 2));
				quad.push(p5.createVector(p.x, p.y - size / 2 + space));
				quad.push(p5.createVector(p.x + size / 2 - space, p.y));
				quad.push(p5.createVector(p.x - size / 2, p.y + size - space));
			}
			drawRoundedPolygon(quad, radius);
		}
	}
	p5.noFill();
	p5.noStroke();
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

const p5 = new P5(sketch);
export default p5;