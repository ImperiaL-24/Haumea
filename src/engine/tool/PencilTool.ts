import { Tool, ToolID } from "./Tool";
import { get, writable, type Writable } from "svelte/store";
import { getClickLocation } from "../../util";
import { canvas, ctx } from "haumea/preview";
import { clickState, colorTarget, modifierState } from "../../store";
import { EyedropperTool } from "./EyedropperTool";
import { currentTab } from "haumea/tab";
import type { Vector2 } from "haumea/math";
import { Color } from "src/haumea/color";

let mouseDownTarget: HTMLElement;

export class PencilTool extends Tool {
    size: Writable<number> = writable(1);
    lastClick: Vector2
    eyedropper: EyedropperTool = new EyedropperTool();
    constructor() {super(ToolID.PENCIL_TOOL)}
    onmousedown = () => {
        if(get(modifierState).altKey) return this.eyedropper.onmousedown();
        // TODO: if last state is the same as new state then do not create new state;
        get(currentTab).canvasData.saveState();

        mouseDownTarget = get(clickState).target;
        const zoom  = get(currentTab).canvasData?.zoom.value;
        const activeLayer = get(currentTab).canvasData?.get().activeLayer.value
        const layer = get(currentTab).canvasData?.get().getCurrentLayer();

        console.log("pencil mouse down!");

        const location = getClickLocation(get(canvas)[activeLayer]).product(1/zoom);
        layer.drawTo(location, get(this.size));
        this.lastClick = location;
    }
    onmousemove = () => {
        if(get(modifierState).altKey) return this.eyedropper.onmousemove();
        if(!get(clickState).leftClick) return;
        const zoom  = get(currentTab).canvasData?.zoom.value;
        const activeLayer = get(currentTab).canvasData?.get().activeLayer.value
        const layer = get(currentTab).canvasData?.get().getCurrentLayer();

        const location = getClickLocation(get(canvas)[activeLayer]).product(1/zoom);
        // if(mouseDownTarget != get(canvas)) return this.lastClick = location;
        if(this.lastClick == undefined) return;

        layer.line(this.lastClick, location, get(this.size));
        
        this.lastClick = location;
    }
    onmouseup = () => {
        if(get(modifierState).altKey) return this.eyedropper.onmouseup();
        mouseDownTarget = null;
        
    }
    onkeydown = (e) => {
        if(e.key == "w") this.size.set(get(this.size)+1);
        if(e.key == "s") this.size.set(get(this.size)-1);
    };
}