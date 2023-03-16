import { clamp } from "src/util";
import { get, writable, type Writable } from "svelte/store";
import { Color } from "./color";
import { PercentagePos, PixelPos, Vector2 } from "haumea/math";
import { App } from "haumea/tab";

export let canvasBase: Writable<HTMLDivElement> = writable();
export let canvasShadow: Writable<HTMLDivElement> = writable();
export let transition: Writable<boolean> = writable(true);


/**
 * @deprecated use App.activeCanvas.canvasData.position.toPixelPos(get(canvasBase))
 */
export let getCanvasPosition = (): PixelPos => {
    return App.activeCanvas.data.position.toPixelPos(get(canvasBase));
}

export let setCanvasPosition = (pos: PixelPos) => {
    const zoom = App.activeCanvas.data.zoom;
    const cw = App.activeCanvas.data.activeState.dimension.value.x*zoom;
    const ch = App.activeCanvas.data.activeState.dimension.value.y*zoom;
    const vw = get(canvasBase).clientWidth;
    const vh = get(canvasBase).clientHeight;
    const newPos = new PercentagePos(
        clamp(pos.x*100/get(canvasBase).clientWidth, (-cw/2+400)*100/vw,(cw/2-400)*100/vw+100),
        clamp(pos.y*100/get(canvasBase).clientHeight, (-ch/2+400)*100/vh,(ch/2-400)*100/vh+100)
    )
    App.activeCanvas.data.position = newPos;
}

export let getPixelColor = (pos: Vector2): Color => {
    const layer = App.activeCanvas.data.activeLayer;
    const clickedColor = layer.ctx.getImageData(pos.x, pos.y, 1, 1).data;
    return new Color(clickedColor[0], clickedColor[1], clickedColor[2]);
}