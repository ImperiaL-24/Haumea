import { clickState, colorTarget } from "../../store";
import { getClickLocation } from "../../util";
import { get, writable, type Writable } from "svelte/store";
import { canvasShadow, getPixelColor } from "haumea/preview";
import { Tool, ToolID } from "./Tool";
import { Color } from "haumea/color";
import { App } from "haumea/tab";

export class EyedropperTool extends Tool {
    originalColor: Writable<Color> = writable();
    newColor: Writable<Color> = writable();
    constructor() {super(ToolID.EYEDROPPER_TOOL)}
    onmousedown = () => {
        
        const zoom  = App.activeCanvas.data.zoom;
        const activeLayer = App.activeCanvas.data.activeState.activeLayer.value

        const location = getClickLocation(get(canvasShadow)).product(1/zoom);
        const pixelColor = getPixelColor(location);
        this.originalColor.set(Color.newFromHSV(...get(colorTarget)));
        this.newColor.set(pixelColor);
    }
    onmousemove = () => {
        if(!get(clickState).leftClick) return;
        const zoom  = App.activeCanvas.data.zoom;
        const activeLayer = App.activeCanvas.data.activeState.activeLayer.value

        const location = getClickLocation(get(canvasShadow)).product(1/zoom);
        const pixelColor = getPixelColor(location);
        this.newColor.set(pixelColor);
    }
    onmouseup = () => {
        colorTarget.set(get(this.newColor).asHSV());
    }
}