import p5 from "./app";

// Theme //https://fffuel.co/cccolor/
export const defGridColors = {
    gridFill: "#0086D430",
    gridStroke: "#0086D470",
    hoverGridFill: "#0086D499",
    hoverGridStroke: "black"
}

export const atkGridColors = {
    gridFill: "#D6000430",
    gridStroke: "#D6000470",
    hoverGridFill: "#D600049E",
    hoverGridStroke: "black"
}

export const shipColors = {
    gridFill: "#0086D470",
    gridFillSucces: "#D6000430",
    gridFillDanger: "#D6000430",
}

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