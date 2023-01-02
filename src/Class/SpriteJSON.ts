export default class SpriteJSON {
    public frames: { name: string, pos: { x: number, y: number, z: number, w: number, h: number } }[];

    constructor(json: any) {
        console.log(json)
        this.frames = json.frames;
    }
}