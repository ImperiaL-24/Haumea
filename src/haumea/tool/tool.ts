import type { Color } from "../color"

export class Brush {
    size: number
    color: Color
    opacity: number
    constructor(size:number, color:Color, opacity:number) {
        this.size = size;
        this.color = color;
        this.opacity = opacity
    }
}