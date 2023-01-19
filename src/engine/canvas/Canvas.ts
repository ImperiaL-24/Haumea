import { clamp } from "../../util";
import { get, writable, type Writable } from "svelte/store";

export let canvas: Writable<HTMLCanvasElement> = writable();
export let canvasBase: Writable<HTMLDivElement> = writable();
export let ctx: Writable<CanvasRenderingContext2D> = writable();
export let zoom: Writable<number> = writable(1);
export let transition: Writable<boolean> = writable(true);

export let setCanvasPosition = (x:number, y:number) => {
    const cw = get(canvas).clientWidth*get(zoom);
    const ch = get(canvas).clientHeight*get(zoom);
    const vw = get(canvasBase).clientWidth;
    const vh = get(canvasBase).clientHeight;

    get(canvas).style.top = `${clamp(y, (-ch/2+400)*100/vh,(ch/2-400)*100/vh+100)}%`;
    get(canvas).style.left = `${clamp(x, (-cw/2+400)*100/vw,(cw/2-400)*100/vw+100)}%`;
}