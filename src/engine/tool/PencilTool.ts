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
    hasSaved: boolean = false;
    constructor() {super(ToolID.PENCIL_TOOL)}
    onmousedown = () => {
        if(get(modifierState).altKey) return this.eyedropper.onmousedown();

        mouseDownTarget = get(clickState).target;

        if(mouseDownTarget.classList.contains("shadow")) {
            get(currentTab).canvasData.saveState();
            this.hasSaved = true;
        }
        const zoom  = get(currentTab).canvasData?.zoom.value;
        const activeLayer = get(currentTab).canvasData?.get().activeLayer.value
        const layer = get(currentTab).canvasData?.getCurrentLayer();

        console.log("pencil mouse down!");

        const location = getClickLocation(get(canvas)[activeLayer]).product(1/zoom);
        layer.drawTo(location, get(this.size));
        this.lastClick = location;
    }
    onmousemove = () => {
        if(get(modifierState).altKey) return this.eyedropper.onmousemove();
        if(!get(clickState).leftClick) return;

        mouseDownTarget = get(clickState).target;

        if(mouseDownTarget.classList.contains("shadow") && this.hasSaved == false) {
            get(currentTab).canvasData.saveState();
            this.hasSaved = true;
        }

        const zoom  = get(currentTab).canvasData?.zoom.value;
        const activeLayer = get(currentTab).canvasData?.get().activeLayer.value
        const layer = get(currentTab).canvasData?.getCurrentLayer();

        const location = getClickLocation(get(canvas)[activeLayer]).product(1/zoom);
        // if(mouseDownTarget != get(canvas)) return this.lastClick = location;
        if(this.lastClick == undefined) return;

        layer.line(this.lastClick, location, get(this.size));
        
        this.lastClick = location;
        this
    }
    onmouseup = () => {
        if(get(modifierState).altKey) return this.eyedropper.onmouseup();
        mouseDownTarget = null;
        this.hasSaved = false;
        
    }
    updateSize(updater: Function) {
        this.size.set(updater(get(this.size)));
    }
    onkeydown = (e) => {
        console.log("EEEEEEEEEEEEEEEEEEEEEEE")
        if(e.key.toLowerCase() == "w") this.size.set(get(this.size)+1);
        if(e.key.toLowerCase() == "s") this.size.set(get(this.size)-1);
    };
}