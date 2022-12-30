import p5 from "./app";
import IsoGrid from "./IsoGrid";
import MyVect from "./MyVect";

export function getRndInArray(list: any): any {
    return list[Math.floor((Math.random() * list.length))];
}

export function windowResized(canvaWidth: number, canvaHeight: number) {
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

export function roundIsosceles(p1, p2, p3, t) {
    let mt = 1 - t,
        c1x = (mt * p1.x + t * p2.x),
        c1y = (mt * p1.y + t * p2.y),
        c2x = (mt * p3.x + t * p2.x),
        c2y = (mt * p3.y + t * p2.y);
    return [c1x, c1y, c2x, c2y];
}

export function drawRoundedPolygon(points, radius) {
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

export function getVectsFromMouse(grid: IsoGrid): MyVect {
    let mouseVect = new MyVect();
    mouseVect.x = Math.floor(p5.mouseX);
    mouseVect.y = Math.floor(p5.mouseY);

    const offset = 40;
    let vects = grid.points.filter(v => {
        return v.x - offset <= mouseVect.x && v.x + offset >= mouseVect.x
            && v.y - offset <= mouseVect.y && v.y + offset >= mouseVect.y
    });

    let found = null;
    if (vects.length >= 0 && vects.length < 10) {
        let minX = Number.MAX_SAFE_INTEGER;
        const deltas = [];

        let foundI = 0;
        for (let i = 0; i < vects.length; i++) {
            const v = vects[i];
            const deltaX = mouseVect.x - v.x;
            deltas.push(deltaX);

            let newMinX = Math.min(deltaX >= 0 ? deltaX : -deltaX, minX);
            if (newMinX !== minX) {
                minX = newMinX;
                foundI = i;
            }

        }
        found = vects[foundI];
    }

    if (found) {
        grid.mouseVect = found;
        p5.mouseX = found.x
        p5.mouseY = found.y
    }

    return found;
}

export function drawCursor() {
    p5.fill('Tomato');
    p5.stroke('black');
    p5.ellipse(p5.mouseX, p5.mouseY, 16, 16);
    return { x: p5.mouseX, y: p5.mouseY, size: 16 };
}
