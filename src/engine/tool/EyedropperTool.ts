import { clickState, colorTarget } from "../../store";
import { getClickLocation } from "../../util";
import { get, writable, type Writable } from "svelte/store";
import { canvas, getPixelColor, zoom } from "../canvas/Canvas";
import { Tool, ToolID } from "./Tool";
import type { Color } from "../../haumea/color";

export class EyedropperTool extends Tool {
    originalColor: Writable<Color> = writable();
    newColor: Writable<Color> = writable();
    constructor() {super(ToolID.EYEDROPPER_TOOL)}
    onmousedown = () => {
        const location = getClickLocation(get(canvas)).product(1/get(zoom));
        const pixelColor = getPixelColor(location);
        this.originalColor.set(pixelColor);
        this.newColor.set(pixelColor);
    }
    onmousemove = () => {
        if(!get(clickState).leftClick) return;
        const location = getClickLocation(get(canvas)).product(1/get(zoom));
        const pixelColor = getPixelColor(location);
        this.newColor.set(pixelColor);
    }
    onmouseup = () => {
        colorTarget.set(get(this.newColor).asHSV());
    }
}