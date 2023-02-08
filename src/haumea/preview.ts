import { clamp } from "src/util";
import { derived, get, writable, type Readable, type Writable } from "svelte/store";
import { Color } from "./color";
import { PercentagePos, PixelPos, Vector2 } from "haumea/math";
import { currentTab, currentTabId, tabs } from "haumea/tab";
import type { CanvasState } from "./canvas";
//TODO: remove canvas, and make a canvasClickZone thing
export let canvas: Writable<HTMLCanvasElement[]> = writable([]);
export let canvasBase: Writable<HTMLDivElement> = writable();
//TODO: remove ctx;
export let ctx: Readable<CanvasRenderingContext2D> = derived([canvas, get(currentTab)?.canvasData?.get().activeLayer.$], ([$canvas, $layer]) => {let layer = get(currentTab)?.canvasData?.get().activeLayer.value; if($canvas[layer]) return $canvas[layer].getContext("2d")});
export let transition: Writable<boolean> = writable(true);

export let getCanvasPosition = (): PixelPos => {
    return get(currentTab).canvasData.position.value.toPixelPos(get(canvasBase));
}

export let setCanvasPosition = (pos: PixelPos) => {
    const zoom = get(currentTab).canvasData.zoom.value;
    const cw = get(tabs).get(get(currentTabId)).canvasData.get().dimension.value.x*zoom;
    const ch = get(tabs).get(get(currentTabId)).canvasData.get().dimension.value.y*zoom;
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

export let getCanvasState = (): CanvasState => {
    
    return get(currentTab).canvasData.get();
}

// export let setCanvasState = (data: CanvasState) => {
//     console.warn("SETCANVAS")
//     get(currentTab).canvasData.stateList.value[get(currentTab).canvasData.stateList.value.length + get(currentTab).canvasData.currentState.value] = data;
//     // get(canvas).width = data.width;
//     // get(canvas).height = data.height;
//     // get(ctx).putImageData(data, 0, 0);
// }