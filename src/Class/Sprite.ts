import P5, { Image, Vector } from "p5";
import p5 from "../app";
import SpriteJSON from "./SpriteJSON";

export default class Sprite {
    x: number;
    y: number;
    images: Image[] = [];
    w: any;
    h: any;
    len: any;
    speed: number;
    index: number;
    angle: number;

    frameWidth: number = 0;
    frameHeight: number = 0;

    constructor(x: number = 0, y: number = 0, speed: number = 1) {
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.index = 0;
        this.angle;
    }

    resize(w: number, h: number) {
        this.frameWidth = w;
        this.frameHeight = h;
    }

    setAngle(a: number = 0) {
        this.angle = a;
    }

    setSpeed(s: number = 1) {
        this.speed = s;
    }

    withImages(images: Image[]): Sprite {
        this.images = images;
        this.w = this.images[0].width;
        this.h = this.images[0].height;
        this.len = this.images.length;

        return this;
    }

    withSpriteJson(sprtData: SpriteJSON, spriteSheet: Image, fEnd: number, fStart: number = 0): Sprite {
        for (let i = fStart; i <= fEnd; i++) {
            const data = sprtData.frames[i];
            const imgFrame: Image = spriteSheet.get(
                data.pos.x, data.pos.y,
                data.pos.w, data.pos.h
            );

            this.images.push(imgFrame);
        }

        this.w = this.images[0].width;
        this.h = this.images[0].height;
        this.len = this.images.length;

        return this;
    }

    getCurrentImage(): Image {
        return this.images[this.getCurrentIndex()];
    }

    getCurrentIndex(): number {
        return Math.floor(this.index) % this.len;
    }

    show(): void {
        p5.translate(this.x, this.y);
        p5.rotate(this.angle);

        p5.image(this.getCurrentImage(), 0, 0, this.frameWidth, this.frameHeight);

        p5.rotate(-this.angle);
        p5.translate(-this.x, -this.y);
    }

    moveTo(x: number, y: number): void {
        this.x = x;
        this.y = y;
    }

    moveToVect(vect: Vector): void {
        this.x = vect.x;
        this.y = vect.y;
    }
}