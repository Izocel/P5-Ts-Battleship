import { onlyUnique } from "../Utils/utils";
import IsoGrid from "./IsoGrid";
import MyVect from "./MyVect";

export default class GridPaterns {
    public selected: string;
    public startVect: MyVect;
    public gridIndexes: number[] = [];
    public gridCtx: IsoGrid;

    constructor(gridCtx: IsoGrid, indexes: number[] = []) {
        this.gridIndexes = indexes;
        this.gridCtx = gridCtx;
    }

    getLine(n: number, si: number) {
        if (n === 1)
            return [si];

        const indexDelta: number = 1;
        let gridOutputs: number[] = [];

        const isEven = n % 2 === 0;
        const leftN = Math.floor(n / 2);

        const start = isEven ? si - leftN : si - leftN - indexDelta + leftN;
        for (let i = 0; i < n; i++) {
            const idx = indexDelta * i + start;
            gridOutputs.push(idx);
        }

        gridOutputs = gridOutputs.filter(onlyUnique);
        gridOutputs.sort(function (a, b) { return a - b });
        return gridOutputs;
    }

    getCross(n: number, si: number) {
        if (n === 1) {
            return [si];
        }

        const indexDelta: number = this.gridCtx.nbCol;
        let gridOutputs: number[] = [];

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

        gridOutputs = gridOutputs.filter(onlyUnique);
        gridOutputs.sort(function (a, b) { return a - b });
        return gridOutputs;
    }

    getSquare(n: number, si: number) {
        if (n === 1)
            return [si];

        let gridOutputs: number[] = [];
        const stepDelta: number = this.gridCtx.nbCol;
        const lineDelta: number = this.gridCtx.nbCol - 1;

        for (let i = 0; i < n; i++) {
            const start = i * stepDelta + si;
            for (let j = 0; j < n; j++) {
                const idx = start + j * lineDelta;
                gridOutputs.push(idx);
            }
        }

        gridOutputs = gridOutputs.filter(onlyUnique);
        gridOutputs.sort(function (a, b) { return a - b });
        return gridOutputs;
    }

    areInGrid(idxArray: number[]): boolean {
        const first = idxArray[0];
        const last = idxArray[idxArray.length - 1];
        const gridBound = this.gridCtx.points.length;

        return first > 0 && first < gridBound
            && last > 0 && last < gridBound;
    }

}
