import { Tool, ToolID } from "./Tool";
import { get, writable, type Writable } from "svelte/store";
import { currentColor } from "../ColorManager";
import { getClickLocation } from "../../util";
import { canvas, ctx, zoom } from "../canvas/Canvas";
import { clickState, modifierState } from "../../store";
import type {  Vector2 } from "../Vector2";
import { EyedropperTool } from "./EyedropperTool";
import { saveCanvas, stateList } from "../canvas/UndoManager";


let draw = (size:number, location: Vector2) => {
    const color = get(currentColor).asRGB();
    
        const pixel = get(ctx).createImageData(size,size);
        let d = pixel.data;
        for(let i = 0;i< pixel.data.length;i+=4) {
            d[i] = color[0];
            d[i+1] = color[1];
            d[i+2] = color[2];
            d[i+3] = 255;    
        }

        let placeLocationX = location.x- (size-1)/2;
        let placeLocationY = location.y - (size-1)/2;

        get(ctx).putImageData(pixel, placeLocationX, placeLocationY)
}

let lineTo = (size: number, start: Vector2, end: Vector2) => {
    const pixelDistance = end.floor().add(start.floor().negate()).abs().maxCoord();

    for(let i=1;i<=pixelDistance;i++) {
        draw(size, start.lerp(end, i/pixelDistance));
    }
}

let mouseDownTarget: HTMLElement;

export class PencilTool extends Tool {
    size: Writable<number> = writable(1);
    lastClick: Vector2
    eyedropper: EyedropperTool = new EyedropperTool();
    constructor() {super(ToolID.PENCIL_TOOL)}
    onmousedown = () => {
        mouseDownTarget = get(clickState).target;


        console.log("pencil mouse down!");
        if(get(modifierState).altKey) return this.eyedropper.onmousedown();
        const location = getClickLocation(get(canvas)).product(1/get(zoom));
        draw(get(this.size), location);
        this.lastClick = location;
    }
    onmousemove = () => {
        if(get(modifierState).altKey) return this.eyedropper.onmousemove();
        if(!get(clickState).leftClick) return;

        
        const location = getClickLocation(get(canvas)).product(1/get(zoom));
        if(mouseDownTarget != get(canvas)) return this.lastClick = location;
        if(this.lastClick == undefined) return;
        
        lineTo(get(this.size), this.lastClick, location);
        
        this.lastClick = location;
    }
    onmouseup = () => {
        if(get(modifierState).altKey) return this.eyedropper.onmouseup();
        mouseDownTarget = null;
        saveCanvas();
        console.log(stateList);
    }
    onkeydown = (e) => {
        if(e.key == "w") this.size.set(get(this.size)+1);
        if(e.key == "s") this.size.set(get(this.size)-1);
    };
}