import p5 from "./app";

export const GRIDBOXRADIUS: number = 1;
export const MIDDLESPACER: number = 50;

export const ORIENTATIONS = [
    'dUp', 'side', 'dDown', 'bottom'
];

export const SHIPNAME: string[] = [
    "Carrier",
    "Battleship",
    "Cruiser",
    "Submarine",
    "Destroyer"
];

export const SHIPCOLORS: unknown = {
    Carrier: {
        stroke: () => p5.stroke('black'),
        fill: () => p5.fill('MediumSeaGreen')
    },
    Battleship: {
        stroke: () => p5.stroke('black'),
        fill: () => p5.fill('SlateBlue')
    },
    Cruiser: {
        stroke: () => p5.stroke('black'),
        fill: () => p5.fill('Orange')
    },
    Submarine: {
        stroke: () => p5.stroke('black'),
        fill: () => p5.fill('Gray')
    },
    Destroyer: {
        stroke: () => p5.stroke('black'),
        fill: () => p5.fill('Tomato')
    }
};