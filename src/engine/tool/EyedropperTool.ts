import { clickState, colorTarget } from "../../store";
import { getClickLocation } from "../../util";
import { get, writable, type Writable } from "svelte/store";
import { canvasShadow, getPixelColor } from "haumea/preview";
import { Tool } from "./Tool";
import { Color } from "haumea/color";
import { App } from "haumea/tab";
import { ToolType } from "./ToolManager";

export class EyedropperTool extends Tool {
    originalColor: Writable<Color> = writable();
    newColor: Writable<Color> = writable();
    constructor() {super("EYEDROPPER_TOOL")}
    onmousedown = () => {
        
        const zoom  = App.activeCanvas.zoom;
        const layer = App.activeCanvas.activeState.activeLayer;
        const location = getClickLocation(get(canvasShadow)).product(1/zoom);
        const pixelColor = layer.getPixelColor(location);
        this.originalColor.set(Color.newFromHSV(...get(colorTarget)));
        this.newColor.set(pixelColor);
    }
    onmousemove = () => {
        if(!get(clickState).leftClick) return;
        const zoom  = App.activeCanvas.zoom;
        const layer = App.activeCanvas.activeState.activeLayer;
        const location = getClickLocation(get(canvasShadow)).product(1/zoom);
        const pixelColor = layer.getPixelColor(location);
        this.newColor.set(pixelColor);
    }
    onmouseup = () => {
        colorTarget.set(get(this.newColor).asHSV());
    }
}