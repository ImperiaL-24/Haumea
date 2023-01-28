import { clamp } from "../../util";
import { get, writable, type Writable } from "svelte/store";
import { Color } from "../Color";
import { Vector2 } from "../Vector2";


export let canvas: Writable<HTMLCanvasElement> = writable();
export let canvasBase: Writable<HTMLDivElement> = writable();
export let ctx: Writable<CanvasRenderingContext2D> = writable();
export let zoom: Writable<number> = writable(1);
export let transition: Writable<boolean> = writable(true);

export let getCanvasPosition = () => {
    return new Vector2(
        parseFloat(get(canvas).style.left.slice(0,-1))/100*get(canvasBase).clientWidth,
        parseFloat(get(canvas).style.top.slice(0,-1))/100*get(canvasBase).clientHeight
    )
}

export let setCanvasPosition = (pos: Vector2) => {
    const cw = get(canvas).clientWidth*get(zoom);
    const ch = get(canvas).clientHeight*get(zoom);
    const vw = get(canvasBase).clientWidth;
    const vh = get(canvasBase).clientHeight;

    get(canvas).style.top = `${clamp(pos.y*100/get(canvasBase).clientHeight, (-ch/2+400)*100/vh,(ch/2-400)*100/vh+100)}%`;
    get(canvas).style.left = `${clamp(pos.x*100/get(canvasBase).clientWidth, (-cw/2+400)*100/vw,(cw/2-400)*100/vw+100)}%`;
}


export let getPixelColor = (pos: Vector2): Color => {
    const clickedColor = get(ctx).getImageData(pos.x, pos.y, 1, 1).data;
    return new Color(clickedColor[0], clickedColor[1], clickedColor[2]);
}

export let getCanvasData = (): ImageData => {

    return get(ctx).getImageData(0, 0, get(canvas).width, get(canvas).height);
}

export let setCanvasData = (data: ImageData) => {
    get(ctx).putImageData(data, 0, 0);
}