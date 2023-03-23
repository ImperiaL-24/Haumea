import { clamp } from "src/util";

export class Vector2 {
    x: number;
    y: number;
    constructor(x:number=0,y:number=0) {
        this.x = x;
        this.y = y;
    }
    set(x:number,y:number) {
        this.x = x;
        this.y = y;
    }
    add(vector: Vector2): Vector2 {
        return new Vector2(this.x + vector.x, this.y + vector.y);
    }
    addScalar(number: number): Vector2 {
        return new Vector2(this.x + number, this.y + number);
    }
    negate(): Vector2 {
        return new Vector2(-this.x, -this.y);
    }
    product(number: number): Vector2 {
        return new Vector2(this.x * number, this.y * number);
    }
    naiveProduct(vector: Vector2): Vector2 {
        return new Vector2(this.x * vector.x, this.y * vector.y);
    }
    distanceFrom(vector: Vector2): number {
        return Math.sqrt(Math.pow(this.x-vector.x,2)+Math.pow(this.y-vector.y,2));
    }
    lerp(vector: Vector2, t: number): Vector2 {
        return new Vector2(
            this.x*(1-t) + vector.x*t,
            this.y*(1-t) + vector.y*t
        )
    }
    floor(): Vector2 {
        return new Vector2(Math.floor(this.x), Math.floor(this.y));
    }
    maxCoord(): number {
        return Math.max(this.x, this.y);
    }
    abs(): Vector2 {
        return new Vector2(Math.abs(this.x), Math.abs(this.y));
    }
    clamp(v1: Vector2, v2:Vector2): Vector2 {
        return new Vector2(
            clamp(this.x, v1.x, v2.x),
            clamp(this.y, v1.y, v2.y)
        )
    }
    asPixelPos(): PixelPos {
        return new PixelPos(this.x, this.y);
    }
    asPercentagePos(): PercentagePos {
        return new PercentagePos(this.x, this.y);
    }
    clone() {
        return new Vector2(this.x, this.y);
    }
}

export class PercentagePos extends Vector2 {
    constructor(x:number=0,y:number=0) {
        super(x,y);
    }
    toPixelPos(element: HTMLElement): PixelPos {
        return new PixelPos(
            this.x/100*element.clientWidth,
            this.y/100*element.clientHeight
        )
    }
}

export class PixelPos extends Vector2 {
    constructor(x:number=0,y:number=0) {
        super(x,y);
    }
    toPercentagePos(element: HTMLElement): PercentagePos {
        return new PercentagePos(
            this.x/element.clientWidth*100,
            this.y/element.clientHeight*100
        )
    }
}