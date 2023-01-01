import P5 from "p5";
import IsoGrid from "./IsoGrid";
import MyVect from "./MyVect";

export default class GridPaterns {
    private p5: P5;
    public selected: string;
    public startVect: MyVect;
    public gridIndexes: number[] = [];
    public gridCtx: IsoGrid;

    constructor(p5: P5, gridCtx: IsoGrid, indexes: number[] = []) {
        this.p5 = p5;
        this.gridIndexes = indexes;
        this.gridCtx = gridCtx;
    }

    getLine(n: number, si: number) {
        if (n === 1)
            return [si];

        const indexDelta: number = 1;
        const gridOutputs: number[] = [];

        const isEven = n % 2 === 0;
        const leftN = Math.floor(n / 2);

        const start = isEven ? si - leftN : si - leftN - indexDelta + leftN;
        for (let i = 0; i < n; i++) {
            const idx = indexDelta * i + start;
            gridOutputs.push(idx);
        }

        return gridOutputs;
    }

    getCross(n: number, si: number) {
        if (n === 1) {
            return [si];
        }

        const indexDelta: number = this.gridCtx.nbCol;
        const gridOutputs: number[] = [];

        const divider = Math.floor(n / 2);
        let start = si - indexDelta * divider;
        for (let i = 0; i < n; i++) {
            const idx = indexDelta * i + start;
            gridOutputs.push(idx)
        }

        start = si - indexDelta * divider + divider;
        for (let i = 0; i < n; i++) {
            const idx = start + (indexDelta * i) - i;
            gridOutputs.push(idx)
        }

        gridOutputs.sort(function (a, b) { return a - b });
        return gridOutputs;
    }

    getSquare(n: number, si: number) {
        if (n === 1)
            return [si];

        const gridOutputs: number[] = [];
        const stepDelta: number = this.gridCtx.nbCol;
        const lineDelta: number = this.gridCtx.nbCol - 1;

        for (let i = 0; i < n; i++) {
            const start = i * stepDelta + si;
            for (let j = 0; j < n; j++) {
                const idx = start + j * lineDelta;
                gridOutputs.push(idx);
            }
        }

        gridOutputs.sort(function (a, b) { return a - b });
        return gridOutputs;
    }

}
