import { Vector } from "p5";
import p5 from "../app";
import { atkGridColors, defGridColors, shipColors } from "../Constants/constants";
import MyVect from "./MyVect";
import Ship from "../Class/Ship";
import { getRndInArray } from "../Utils/utils";


export default class IsoGrid {
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

    constructor(type: string) {
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
        if (!this.padding) {
            this.padding = this.size * 0.1;
        }

        return this.padding;
    }

    getAllShipIndexes(): number[] {
        let outputs: number[] = [];
        Object.entries(this.ships).forEach(s => {
            const ship: Ship = s[1];

            ship.gridIndex?.forEach(i => {
                outputs.push(i);
            });
        });

        return outputs;
    }

    shipAtIndex(idx: number) {
        return this.getAllShipIndexes().includes(idx);
    }

    setupIsoGrid(start: Vector = new Vector()): MyVect[] {
        for (let y = this.size / 2; y < this.height; y += this.size / 2) {
            let x = ((y) % (this.size) == 0) ? this.size : this.size / 2;
            let firstInRow = true;

            for (; x < this.width; x += this.size) {
                let p: MyVect = p5.createVector(x, y + start.y, 1);

                p.orientation = getRndInArray(["dUp", "dDown"]);
                p.fillColor = this.colors.gridFill;
                p.strokeColor = this.colors.gridStroke;
                p.pinColor = "white";
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

    setGridPin(vects: MyVect[] = this.points, showIndex: boolean = this.showIndex, showPin: boolean = this.showPin) {
        if (!vects?.length) { return; }

        vects.forEach(p => {
            p.showIndex = showIndex;
            p.showPin = showPin;
        });
    }

    drawGridPin(vects: MyVect[] = this.points) {
        if (!vects?.length) { return; }

        p5.stroke(this.colors.hoverGridStroke);
        vects.forEach((p, i) => {
            if (p.showPin) {
                p5.fill(p.pinColor);
                p5.ellipse(p.x, p.y, this.size / 6, this.size / 6);
            }

            if (p.showIndex) {
                p5.fill("black");
                p5.stroke("black");
                p5.textSize(this.size / 6)
                p5.text(i, p.x - this.size / 8, p.y + this.size / 4);
            }
        });

        p5.noFill();
        p5.noStroke();
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

    fillGridIndexes(idx: number[], colors = { fill: "white", stroke: "black" }) {
        idx.forEach(i => {
            const p = this.points[i];
            p.isMouseHover = this.mouseVect == p;
            const fill = p.isMouseHover ? this.colors.hoverGridFill : colors.fill;
            const stroke = p.isMouseHover ? this.colors.hoverGridStroke : colors.stroke;
            p5.stroke(stroke);
            p5.fill(fill);

            p5.beginShape();
            p5.vertex(p.x - this.size / 2, p.y);
            p5.vertex(p.x, p.y - this.size / 2);
            p5.vertex(p.x + this.size / 2, p.y);
            p5.vertex(p.x, p.y + this.size / 2);
            p5.endShape(p5.CLOSE);
        });

        // Extras

        p5.noFill();
        p5.noStroke();
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
            p5.stroke(stroke);
            p5.fill(fill);

            p5.beginShape();
            p5.vertex(p.x - this.size / 2, p.y);
            p5.vertex(p.x, p.y - this.size / 2);
            p5.vertex(p.x + this.size / 2, p.y);
            p5.vertex(p.x, p.y + this.size / 2);
            p5.endShape(p5.CLOSE);
        });

        // Extras

        p5.noFill();
        p5.noStroke();
    }
}
