import P5, { Vector } from "p5";
import { atkGridColors, defGridColors, shipColors } from "../Constants/constants";
import MyVect from "./MyVect";
import Ship from "../Class/Ship";
import { getRndInArray } from "../Utils/utils";


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

    public ships: { [s: string]: Ship; };
    colors: any;

    public showIndex: boolean = true;
    public showPin: boolean = true;

    constructor(p5: P5, type: string) {
        this.p5 = p5;
        this.points = [];
        this.ships = {
            Carrier: null,
            Battleship: null,
            Cruiser: null,
            Submarine: null,
            Destroyer: null
        }
        
        this.type = type;
        this.colors = this.type === "attack" ? atkGridColors : defGridColors;
    }

    getPadding() {
        if(!this.padding) {
            this.padding = this.size * 0.1;
        }

        return this.padding;
    }

    setupIsoGrid(start: Vector = new Vector()): MyVect[] {
        for (let y = this.size / 2; y < this.height; y += this.size / 2) {
            let x = ((y) % (this.size) == 0) ? this.size : this.size / 2;
            let firstInRow = true;

            for (; x < this.width; x += this.size) {
                let p: MyVect = this.p5.createVector(x, y + start.y, 1);

                p.orientation = getRndInArray(["dUp", "dDown"]);
                p.fillColor = this.colors.gridFill;
                p.strokeColor = this.colors.gridStroke;
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

    toggleShowindex() {
        this.showIndex = !this.showIndex;
        return this.showIndex;
    }

    toggleShowPin() {
        this.showPin = !this.showPin;
        return this.showPin;
    }

    drawGridPin(vects: MyVect[] = this.points, showIndex: boolean = this.showIndex, showPin: boolean = this.showPin) {
        if (!vects?.length) { return; }

        this.p5.stroke(this.colors.hoverGridStroke);
        vects.forEach((p, i) => {

            if (showPin) {
                this.p5.fill('white');
                this.p5.ellipse(p.x, p.y, this.size/6, this.size/6);
            }

            if (showIndex) {
                this.p5.fill("black");
                this.p5.stroke("black");
                this.p5.textSize(this.size/6)
                this.p5.text(i, p.x - this.size/8, p.y + this.size/4);
            }
        });

        this.p5.noFill();
        this.p5.noStroke();
    }

    colorShipGrid() {
        Object.entries(this.ships).forEach(s => {
            const ship: Ship = s[1];

            if (!ship?.checkVectIntegrity())
                return;

            ship.gridIndex?.forEach(i => {
                this.points[i].fillColor = shipColors.gridFill
                this.points[i].strokeColor = "black";
            });
        });
    }

    fillGridIndexes(idx:number[], colors = {fill:"white", stroke:"black"}) {
        idx.forEach(i => {
            const p = this.points[i];
            p.isMouseHover = this.mouseVect == p;
            const fill = p.isMouseHover ? this.colors.hoverGridFill : colors.fill;
            const stroke = p.isMouseHover ? this.colors.hoverGridStroke : colors.stroke;
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

        this.p5.noFill();
        this.p5.noStroke();
    }

    drawIsoGrid() {
        this.points.forEach((p: MyVect, i) => {
            p.isMouseHover = this.mouseVect == p;
            p.fillColor = p.isMouseHover ? this.colors.hoverGridFill : this.colors.gridFill;
            p.strokeColor = p.isMouseHover ? this.colors.hoverGridStroke : this.colors.gridStroke;
        });

        this.colorShipGrid();

        this.points.forEach((p: MyVect, i) => {
            p.isMouseHover = this.mouseVect == p;
            const fill = p.isMouseHover ? this.colors.hoverGridFill : p.fillColor;
            const stroke = p.isMouseHover ? this.colors.hoverGridStroke : p.strokeColor;
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

        this.p5.noFill();
        this.p5.noStroke();
    }
}
