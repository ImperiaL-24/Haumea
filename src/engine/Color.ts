export class Color {
    r: number;
    g: number;
    b: number;
    constructor(red?: number, green?: number, blue?: number) {
        this.r = Math.round(red) ?? 0;
        this.g = Math.round(green) ?? 0;
        this.b = Math.round(blue) ?? 0;
    }

    asArray(): [number, number, number] {
        return [this.r,this.g,this.b];
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