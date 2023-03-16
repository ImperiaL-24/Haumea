import { Tool, ToolID } from "./Tool";
import { get, writable, type Writable } from "svelte/store";
import { getClickLocation } from "../../util";
import { canvasShadow } from "haumea/preview";
import { clickState, modifierState } from "../../store";
import { EyedropperTool } from "./EyedropperTool";
import { App } from "haumea/tab";
import type { Vector2 } from "haumea/math";

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
        if(mouseDownTarget.parentElement.parentElement.classList.contains("shadow")) {
            App.activeCanvas.data.addState();
            this.hasSaved = true;
        }
        const zoom  = App.activeCanvas.data.zoom;
        const activeLayer = App.activeCanvas.data.activeState.activeLayer.value
        const layer = App.activeCanvas.data.activeLayer;

        console.log("pencil mouse down!");

        const location = getClickLocation(get(canvasShadow)).product(1/zoom);
        layer.drawTo(location, get(this.size));
        this.lastClick = location;
    }
    onmousemove = () => {
        if(get(modifierState).altKey) return this.eyedropper.onmousemove();
        if(!get(clickState).leftClick) return;

        mouseDownTarget = get(clickState).target;

        if(mouseDownTarget.parentElement.parentElement.classList.contains("shadow") && this.hasSaved == false) {
            App.activeCanvas.data.addState();
            this.hasSaved = true;
        }

        const zoom  = App.activeCanvas.data.zoom;
        const activeLayer = App.activeCanvas.data.activeState.activeLayer.value
        const layer = App.activeCanvas.data.activeLayer;

        const location = getClickLocation(get(canvasShadow)).product(1/zoom);
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