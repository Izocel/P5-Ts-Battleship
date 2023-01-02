import { Vector } from "p5";
import p5 from "../app";
import IsoGrid from "./IsoGrid";
import MyVect from "./MyVect";
import { drawRoundedPolygon } from "../Utils/utils";
import { GRIDBOXRADIUS, ORIENTATIONS, SHIPCOLORS } from "../Constants/constants";

export default class Ship extends MyVect {
    grid: IsoGrid;
    maxHp: number = 2;
    hp: number = this.maxHp;
    gridIndex: number[] = [];
    name: string = "Destroyer";
    colors = { ...SHIPCOLORS[this.name] };
    hidden: boolean = false;

    constructor(name: string = "Destroyer", pv: number = 2, grid: IsoGrid) {
        super();
        this.hp = pv;
        this.maxHp = pv;
        this.grid = grid;
        this.name = name;

        this.updateGridIndex();
        this.grid.ships[this.name] = this;
    }

    getGridDelta() {
        if (this.orientation == "dDown") {
            return this.grid.nbCol;
        }
        else if (this.orientation == "dUp") {
            return -this.grid.nbCol + 1;
        }
        else if (this.orientation == "side") {
            return 1;
        }
        else if (this.orientation == "bottom") {
            return this.grid.nbCol * 2 - 1;
        }
    }

    areDiagDown(p1, p2) {
        return p1.x < p2.x
            && p1.y < p2.y;
    }

    areDiagUp(p1, p2) {
        return p1.x < p2.x
            && p1.y > p2.y;
    }

    areHorizontalLeft(p1, p2) {
        return p1.x < p2.x
            && p1.y === p2.y;
    }

    areVerticalDown(p1, p2) {
        return p1.x === p2.x
            && p1.y < p2.y;
    }

    checkVectIntegrity(idxArr: number[] = this.gridIndex) {
        let check;
        switch (this.orientation) {
            case "dDown":
                check = this.areDiagDown;
                break;
            case "dUp":
                check = this.areDiagUp;
                break;

            case "side":
                check = this.areHorizontalLeft;
                break;
            case "bottom":
                check = this.areVerticalDown;
                break;

            default:
                return false
        }

        for (let i = 0; i < idxArr.length - 1; i++) {
            const i1 = idxArr[i];
            const i2 = idxArr[i + 1];

            const p1 = this.grid.points[i1];
            const p2 = this.grid.points[i2];

            if (!check(p1, p2))
                return false;
        }

        return true;
    }

    updateGridIndex(start: number = this.gridIndex[0]) {
        if (typeof start !== "number") { return; }

        const delta = this.getGridDelta();

        const temp: number[] = [];
        for (let i = 0; i < this.maxHp; i++) {
            const index = delta * i + start;
            temp[i] = index;

            if (!this.grid.points[index])
                return null;
        }

        if (!this.checkVectIntegrity(temp))
            return null;

        this.gridIndex = temp;
        return this.gridIndex;
    }

    toggleHidden(): boolean {
        if (this.hidden)
            this.colors = { ...SHIPCOLORS[this.name] };
        else {
            this.colors.fill = () => p5.noFill();
            this.colors.stroke = () => p5.noStroke();
        }

        this.hidden = !this.hidden;
        return this.hidden;
    }

    toggleOrientation(): string {
        if (this.orientation === "bottom" || this.orientation === "side")
            this.gridIndex[0] += this.grid.nbCol - 1;

        let index = ORIENTATIONS.indexOf(this.orientation, 0) + 1;
        index = index > ORIENTATIONS.length - 1 ? 0 : index;
        this.orientation = ORIENTATIONS[index];

        if (this.orientation === "dDown" || this.orientation === "bottom")
            this.gridIndex[0] -= this.grid.nbCol - 1;

        this.updateGridIndex();
        return this.orientation;
    }

    //draw colords rects
    draw() {
        this.updateGridIndex();
        if (!this.checkVectIntegrity())
            return;

        const gridStart = this.gridIndex[0];
        const p = this.grid.points[gridStart];
        if (!p) { return; }

        const gridEnd = this.gridIndex[this.gridIndex.length - 1];
        const pEnd = this.grid.points[gridEnd];
        if (!pEnd) { return; }

        const quad: Vector[] = [];
        if (this.orientation == "dDown") {
            quad.push(p5.createVector(p.x, p.y - this.grid.size / 2 + this.grid.getPadding()));
            quad.push(p5.createVector(pEnd.x + this.grid.size / 2 - this.grid.getPadding(), pEnd.y));

            quad.push(p5.createVector(pEnd.x, pEnd.y + this.grid.size / 2 - this.grid.getPadding()));
            quad.push(p5.createVector(p.x - this.grid.size / 2 + this.grid.getPadding(), p.y));
        }
        else if (this.orientation == "dUp") {
            quad.push(p5.createVector(p.x - this.grid.size / 2 + this.grid.getPadding(), p.y));
            quad.push(p5.createVector(pEnd.x, pEnd.y - this.grid.size / 2 + this.grid.getPadding()));
            quad.push(p5.createVector(pEnd.x + this.grid.size / 2 - this.grid.getPadding(), pEnd.y));
            quad.push(p5.createVector(p.x, p.y + this.grid.size / 2 - this.grid.getPadding()));
        }
        else if (this.orientation == "side") {
            const long = this.grid.size * (this.maxHp - 1);
            quad.push(p5.createVector(p.x - this.grid.getPadding() * 1.5, p.y - this.grid.size / 4 - this.grid.getPadding()));
            quad.push(p5.createVector(p.x + long + this.grid.getPadding() * 2, p.y - this.grid.size / 4 - this.grid.getPadding()));
            quad.push(p5.createVector(p.x + long + this.grid.getPadding() * 2, p.y + this.grid.size / 4 + this.grid.getPadding() / 2));
            quad.push(p5.createVector(p.x - this.grid.getPadding() * 1.5, p.y + this.grid.size / 4 + this.grid.getPadding() / 2));
        }
        else if (this.orientation == "bottom") {
            const long = this.grid.size * (this.maxHp - 1);
            quad.push(p5.createVector(p.x + this.grid.size / 2 - this.grid.getPadding() * 2, p.y - this.grid.size / 4 + this.grid.getPadding()));
            quad.push(p5.createVector(p.x - this.grid.size / 2 + this.grid.getPadding() * 2, p.y - this.grid.size / 4 + this.grid.getPadding()));
            quad.push(p5.createVector(p.x - this.grid.size / 2 + this.grid.getPadding() * 2, p.y + long + this.grid.getPadding() * 1.5));
            quad.push(p5.createVector(p.x + this.grid.size / 2 - this.grid.getPadding() * 2, p.y + long + this.grid.getPadding() * 1.5));
        }

        this.colors.fill();
        this.colors.stroke();
        drawRoundedPolygon(quad, GRIDBOXRADIUS);
    }
}
