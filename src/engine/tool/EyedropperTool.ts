import { clickState, colorTarget } from "../../store";
import { getClickLocation } from "../../util";
import { get, writable, type Writable } from "svelte/store";
import { canvas, getPixelColor } from "haumea/preview";
import { Tool, ToolID } from "./Tool";
import { Color } from "haumea/color";
import { currentTab } from "haumea/tab";

export class EyedropperTool extends Tool {
    originalColor: Writable<Color> = writable();
    newColor: Writable<Color> = writable();
    constructor() {super(ToolID.EYEDROPPER_TOOL)}
    onmousedown = () => {
        const zoom  = get(currentTab).canvasData?.zoom.value;
        const activeLayer = get(currentTab).canvasData?.get().activeLayer.value

        const location = getClickLocation(get(canvas)[activeLayer]).product(1/zoom);
        const pixelColor = getPixelColor(location);
        this.originalColor.set(Color.newFromHSV(...get(colorTarget)));
        this.newColor.set(pixelColor);
    }
    onmousemove = () => {
        if(!get(clickState).leftClick) return;
        const zoom  = get(currentTab).canvasData?.zoom.value;
        const activeLayer = get(currentTab).canvasData?.get().activeLayer.value

        const location = getClickLocation(get(canvas)[activeLayer]).product(1/zoom);
        const pixelColor = getPixelColor(location);
        this.newColor.set(pixelColor);
    }
    onmouseup = () => {
        colorTarget.set(get(this.newColor).asHSV());
    }
}