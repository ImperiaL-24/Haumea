export class Color {
    private r: number;
    private g: number;
    private b: number;
    constructor(red?: number, green?: number, blue?: number) {
        this.r = Math.round(red) ?? 0;
        this.g = Math.round(green) ?? 0;
        this.b = Math.round(blue) ?? 0;
    }

    /**
     * Creates a {@link Color} object from HSV values.
     * @param hue value from 0-360
     * @param saturation from 0-1.0
     * @param value from 0-1.0
     */
    static newFromHSV(h: number, s: number, v: number) {
        let f= (n:number,k=(n+h/60)%6) => v - v*s*Math.max( Math.min(k,4-k,1), 0);     
        return new Color(f(5)* 255,f(3)* 255,f(1)* 255); 
    }

    asRGB(): [number, number, number] {
        return [this.r,this.g,this.b];
    }

    asHSV(): [number, number, number] {
        let r = this.r/255;
        let g = this.g/255;
        let b = this.b/255;
        let v = Math.max(r,g,b), c=v-Math.min(r,g,b);
        let h = c && ((v==r) ? (g-b)/c : ((v==g) ? 2+(b-r)/c : 4+(r-g)/c)); 
        return [60*(h<0?h+6:h), v&&c/v, v];
    }

    asHex(): string {
        let string = "#";

        let red = this.r.toString(16);
        if(red.length==1) red = "0" + red;
        string += red;

        let green = this.g.toString(16);
        if(green.length==1) green = "0" + green;
        string += green;

        let blue = this.b.toString(16);
        if(blue.length==1) blue = "0" + blue;
        string += blue;

        return string;
    }
}