import { clamp, getClickLocation } from "../../util";
import { get } from "svelte/store";
import { currentColor } from "../ColorManager";
import { canvas, canvasBase, ctx, transition, zoom } from "../canvas/Canvas";

export class Tool {
    onclick: Function
}

export class MoveTool extends Tool {
    onclick = (e) => {
        transition.set(false);
        const imagepos = [parseFloat(get(canvas).style.left.slice(0,-1)),parseFloat(get(canvas).style.top.slice(0,-1))]

        let percentageX = e.movementX * 100 / get(canvasBase).clientWidth;
        let percentageY = e.movementY * 100 / get(canvasBase).clientHeight;
        //get(canvas).clientWidth*get(zoom)*-0.4*100/get(canvasBase).clientWidth,Math.min(100,)

        //TODO: CANVAS POS LIMITS
        get(canvas).style.top = `${clamp(imagepos[1] + percentageY,0,100)}%`;
        get(canvas).style.left = `${clamp(imagepos[0] + percentageX, 0,100)}%`;
    }
}

export class PencilTool extends Tool {
    onclick = (e) => {
        if(e.altKey) console.log("Food Please!");
        const color = get(currentColor).asRGB();
        const location = getClickLocation(get(canvas), e);
        const pixel = get(ctx).createImageData(1,1);
        let d = pixel.data;
        d[0] = color[0];
        d[1] = color[1];
        d[2] = color[2];
        d[3] = 255;    
        get(ctx).putImageData(pixel, location.x/get(zoom), location.y/get(zoom))
    }
}

export enum ToolID {
    MOVE_TOOL,
    PENCIL_TOOL
}

export class ToolType {
    public static MOVE_TOOL = new ToolType(ToolID.MOVE_TOOL, new MoveTool());
    public static PENCIL_TOOL = new ToolType(ToolID.PENCIL_TOOL, new PencilTool());
    constructor(public type:ToolID, public tool:Tool) {}
}

