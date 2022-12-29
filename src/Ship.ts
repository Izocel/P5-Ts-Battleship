import p5 from "./app";
import { GRIDBOXRADIUS, ORIENTATIONS, SHIPCOLORS } from "./constants";
import IsoGrid from "./IsoGrid";
import MyVect from "./MyVect";
import { drawRoundedPolygon } from "./utils";

export default class Ship extends MyVect {
    grid: IsoGrid;
    gridStart: number;
    gridStop: number;
    maxHp: number = 2;
    hp: number = this.maxHp;
    name: string = "Destroyer";
    colors = { ...SHIPCOLORS[this.name] };
    hidden: boolean = false;

    constructor(name: string = "Destroyer", pv: number = 2, grid: IsoGrid) {
        super();
        this.hp = pv;
        this.maxHp = pv;
        this.grid = grid;
        this.name = name;

        this.grid.ships[this.name] = this;
    }

    toggleHidden() {
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
            this.gridStart += this.grid.nbCol - 1;

        let index = ORIENTATIONS.indexOf(this.orientation, 0) + 1;
        index = index > ORIENTATIONS.length - 1 ? 0 : index;
        this.orientation = ORIENTATIONS[index];

        if (this.orientation === "dDown" || this.orientation === "bottom")
            this.gridStart -= this.grid.nbCol - 1;

        return this.orientation;
    }

    //draw colords rects
    draw() {
        let p = this.grid.points[this.gridStart];

        if (!p) { return; }

        let quad = [];
        if (this.orientation == "dDown") {
            const indexDelta = this.grid.nbCol * (this.maxHp - 1);
            this.gridStop = this.gridStart + indexDelta;
            let pEnd = this.grid.points[this.gridStop];
            if (!pEnd)
                return;

            quad.push(p5.createVector(p.x, p.y - this.grid.size / 2 + this.grid.padding));
            quad.push(p5.createVector(pEnd.x + this.grid.size / 2 - this.grid.padding, pEnd.y));

            quad.push(p5.createVector(pEnd.x, pEnd.y + this.grid.size / 2 - this.grid.padding));
            quad.push(p5.createVector(p.x - this.grid.size / 2 + this.grid.padding, p.y));
        }
        else if (this.orientation == "dUp") {
            const indexDelta = (this.grid.nbCol - 1) * (this.maxHp - 1);
            this.gridStop = this.gridStart - indexDelta;
            let pEnd = this.grid.points[this.gridStop];
            if (!pEnd)
                return;

            quad.push(p5.createVector(p.x - this.grid.size / 2 + this.grid.padding, p.y));
            quad.push(p5.createVector(pEnd.x, pEnd.y - this.grid.size / 2 + this.grid.padding));
            quad.push(p5.createVector(pEnd.x + this.grid.size / 2 - this.grid.padding, pEnd.y));
            quad.push(p5.createVector(p.x, p.y + this.grid.size / 2 - this.grid.padding));

        }
        else if (this.orientation == "side") {
            const indexDelta = (this.maxHp - 1);
            this.gridStop = this.gridStart + indexDelta;
            let pEnd = this.grid.points[this.gridStop];
            if (!pEnd)
                return;

            const long = this.grid.size * (this.maxHp - 1);
            quad.push(p5.createVector(p.x - this.grid.padding, p.y - this.grid.size / 4 - this.grid.padding));
            quad.push(p5.createVector(p.x + long + this.grid.padding, p.y - this.grid.size / 4 - this.grid.padding));
            quad.push(p5.createVector(p.x + long + this.grid.padding, p.y + this.grid.size / 4 + this.grid.padding / 2));
            quad.push(p5.createVector(p.x - this.grid.padding, p.y + this.grid.size / 4 + this.grid.padding / 2));
        }
        else if (this.orientation == "bottom") {
            const indexDelta = 2 * this.grid.nbCol * (this.maxHp - 1) - this.maxHp + 1;
            this.gridStop = this.gridStart + indexDelta;
            let pEnd = this.grid.points[this.gridStop];
            if (!pEnd)
                return;

            const long = this.grid.size * (this.maxHp - 1);
            quad.push(p5.createVector(p.x + this.grid.size / 2 - this.grid.padding * 2, p.y - this.grid.size / 4 + this.grid.padding));
            quad.push(p5.createVector(p.x - this.grid.size / 2 + this.grid.padding * 2, p.y - this.grid.size / 4 + this.grid.padding));
            quad.push(p5.createVector(p.x - this.grid.size / 2 + this.grid.padding * 2, p.y + long + this.grid.padding));
            quad.push(p5.createVector(p.x + this.grid.size / 2 - this.grid.padding * 2, p.y + long + this.grid.padding));
        }

        this.colors.fill();
        this.colors.stroke();
        drawRoundedPolygon(quad, GRIDBOXRADIUS);
    }
}
