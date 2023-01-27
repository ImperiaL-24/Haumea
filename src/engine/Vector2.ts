import { clamp } from "../util";

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
    distanceFrom(vector: Vector2): number {
        return Math.sqrt(Math.pow(this.x-vector.x,2)+Math.pow(this.y-vector.y,2));
    }
    clamp(v1: Vector2, v2:Vector2): Vector2 {
        return new Vector2(
            clamp(this.x, v1.x, v2.x),
            clamp(this.y, v1.y, v2.y)
        )
    }
}