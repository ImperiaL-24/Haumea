import { Tool } from "./Tool";
import { get, writable, type Writable } from "svelte/store";
import { getClickLocation } from "../../util";
import { canvasShadow, getCanvasPosition, setCanvasPosition, transition } from "haumea/preview";
import { clickState, modifierState } from "../../store";
import { EyedropperTool } from "./EyedropperTool";
import { App } from "haumea/tab";
import { Vector2 } from "haumea/math";
import { Brush } from "src/haumea/tool/tool";
import { Color } from "src/haumea/color";
import { ToolType } from "./ToolManager";

let mouseDownTarget: HTMLElement;

export class EraserTool extends Tool {
    size: Writable<number> = writable(1);
    lastClick: Vector2
    lastZoom: number;
    eyedropper: EyedropperTool = new EyedropperTool();
    hasSaved: boolean = false;
    constructor() {super("ERASER_TOOL")}
    onmousedown = () => {
        if(get(modifierState).altKey) return;
        mouseDownTarget = get(clickState).target;
        if(mouseDownTarget.parentElement.parentElement.classList.contains("shadow")) {
            App.activeCanvas.addState();
            this.hasSaved = true;
        }
        const zoom  = App.activeCanvas.zoom;
        const layer = App.activeCanvas.activeState.activeLayer;

        const location = getClickLocation(get(canvasShadow)).product(1/zoom);
        layer.drawTo(location, new Brush(get(this.size), new Color(), 0));
        this.lastClick = location;
    }
    onmousemove = () => {
        
        const zoom  = App.activeCanvas?.zoom;

        if(get(modifierState).altKey &&  get(clickState).rightClick) {
            if(this.lastZoom == null) this.lastZoom = get(this.size);
            console.log(get(clickState).rightClickDelta.product(1/zoom).floor().x, this.lastZoom);
            this.size.update(() => Math.max(1,this.lastZoom+get(clickState).rightClickDelta.product(1/zoom).floor().x))
            return;
        }
        if(!get(clickState).leftClick) return;
        mouseDownTarget = get(clickState).target;

        if(mouseDownTarget.parentElement.parentElement.classList.contains("shadow") && this.hasSaved == false) {
            App.activeCanvas.addState();
            this.hasSaved = true;
        }

        
        const layer = App.activeCanvas.activeState.activeLayer;

        const location = getClickLocation(get(canvasShadow)).product(1/zoom);
        // if(mouseDownTarget != get(canvas)) return this.lastClick = location;
        if(this.lastClick == undefined) return;

        layer.line(this.lastClick, location, new Brush(get(this.size), new Color(), 0));
        
        this.lastClick = location;
        this
    }
    onmouseup = () => {
        this.lastZoom = null;
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
    onwheel = (e) => {
        if(get(modifierState).altKey) {
            App.activeCanvas.zoomBy(e.deltaY);
            return;
        }
        let delta = e.deltaY > 0 ? -50*App.activeCanvas.zoom/100-10 : 50*App.activeCanvas.zoom/100+10;
        let distance: Vector2 = get(modifierState).ctrlKey ? new Vector2(delta, 0) : new Vector2(0, delta);
        setCanvasPosition(getCanvasPosition().add(distance).asPixelPos());
    }
}