
interface position {
    left?:number;
    right?:number;
}

export interface SwapPosition {
    buttonPosition:"left" | "right";
    orderVisible:boolean;
    swapPosition:position;
    hiddenPosition:position;
    orderPosition:position;
    bottomDistance:number;
}