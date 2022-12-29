import P5, { Vector } from "p5";
import MyVect from "./MyVect";
import Ship from "./Ship";
import { getRndInArray } from "./utils";

export default class IsoGrid {
    private p5: P5;
    public height: number;
    public width: number;
    public nbCol: number;
    public nbRow: number;
    public padding: number;
    public size: number;

    public type: string;
    public points: MyVect[];
    public pointSize: number;
    public mouseVect: unknown | MyVect;

    public hoverFillColor: string;
    public hoverStrokeColor?: string;
    public fillColor: string = "white";
    public strokeColor: string = "black";
    public ships: { 
        Carrier: typeof Ship; 
        Battleship: typeof Ship; 
        Cruiser: typeof Ship; 
        Submarine: typeof Ship; 
        Destroyer: typeof Ship; 
    };

    constructor(p5: P5) {
        this.p5 = p5;
        this.points = [];
        this.ships = {
            Carrier: Ship,
            Battleship: Ship,
            Cruiser: Ship,
            Submarine: Ship,
            Destroyer: Ship
        }
    }

    setupIsoGrid(start: Vector = new Vector()): MyVect[] {
        for (let y = this.size / 2; y < this.height; y += this.size / 2) {
            let x = ((y) % (this.size) == 0) ? this.size : this.size / 2;
            let firstInRow = true;

            for (; x < this.width; x += this.size) {
                let p: MyVect = this.p5.createVector(x, y + start.y, 1);
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
        this.points.forEach((p: MyVect, i) => {
            p.isMouseHover = this.mouseVect == p;
            const fill = p.isMouseHover ? this.hoverFillColor : this.fillColor;
            const stroke = p.isMouseHover ? this.hoverStrokeColor : this.strokeColor;
            this.p5.stroke(stroke);
            this.p5.fill(fill);

            this.p5.beginShape();
            this.p5.vertex(p.x - this.size / 2, p.y);
            this.p5.vertex(p.x, p.y - this.size / 2);
            this.p5.vertex(p.x + this.size / 2, p.y);
            this.p5.vertex(p.x, p.y + this.size / 2);
            this.p5.endShape(this.p5.CLOSE);
        });

        // Extras
        this.points.forEach((p, i) => {
            //center
            this.p5.fill('white');
            this.p5.ellipse(p.x, p.y, 16, 16);

            //index
            this.p5.fill(0, 0, 0);
            this.p5.text(i, p.x - 6, p.y + 20);
        });

        this.p5.noFill();
        this.p5.noStroke();
    }
}
