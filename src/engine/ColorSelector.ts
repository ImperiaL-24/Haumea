import { Color } from "./Color";

export let getImage = (hue: number): Uint8ClampedArray => {
    let buffer = new Uint8ClampedArray(255 * 255 * 4);
    let color = Color.newFromHSV(hue,1.,1.).asRGB();
    for (let y = 0; y < 255; y++) {
        for (let x = 0; x < 255; x++) {
            let pos = (y * 255 + x) * 4;

            let height: number = 1 - y / 255;
            let width: number = 1 - x / 255;

            buffer[pos] = (color[0] + ((255 - color[0]) * width)) * height;
            buffer[pos + 1] = (color[1] + ((255 - color[1]) * width)) * height;
            buffer[pos + 2] = (color[2] + ((255 - color[2]) * width)) * height;
            buffer[pos + 3] = 255;
        }
    }
    return buffer;
}

