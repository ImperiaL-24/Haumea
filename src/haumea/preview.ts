import { clamp } from "src/util";
import { get, writable, type Writable } from "svelte/store";
import { Color } from "./color";
import { PercentagePos, PixelPos, Vector2 } from "haumea/math";
import { currentTab, currentTabId, tabs } from "haumea/tab";


export let canvas: Writable<HTMLCanvasElement> = writable();
export let canvasBase: Writable<HTMLDivElement> = writable();
export let ctx: Writable<CanvasRenderingContext2D> = writable();
export let transition: Writable<boolean> = writable(true);

export let getCanvasPosition = (): PixelPos => {
    return get(currentTab).canvasData.position.value.toPixelPos(get(canvasBase));

}

export let setCanvasPosition = (pos: PixelPos) => {
    const zoom = get(currentTab).canvasData.zoom.value;
    const cw = get(canvas).clientWidth*zoom;
    const ch = get(canvas).clientHeight*zoom;
    const vw = get(canvasBase).clientWidth;
    const vh = get(canvasBase).clientHeight;
    const newPos = new PercentagePos(
        clamp(pos.x*100/get(canvasBase).clientWidth, (-cw/2+400)*100/vw,(cw/2-400)*100/vw+100),
        clamp(pos.y*100/get(canvasBase).clientHeight, (-ch/2+400)*100/vh,(ch/2-400)*100/vh+100)
    )
    get(tabs).get(get(currentTabId)).canvasData.position.value = newPos;
}


export let getPixelColor = (pos: Vector2): Color => {
    const clickedColor = get(ctx).getImageData(pos.x, pos.y, 1, 1).data;
    return new Color(clickedColor[0], clickedColor[1], clickedColor[2]);
}

export let getCanvasData = (): ImageData => {

    return get(ctx).getImageData(0, 0, get(canvas).width, get(canvas).height);
}

export let setCanvasData = (data: ImageData) => {
    console.warn("SETCANVAS")
    get(canvas).width = data.width;
    get(canvas).height = data.height;
    get(ctx).putImageData(data, 0, 0);
}