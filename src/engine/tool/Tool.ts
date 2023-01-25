import { clamp, getClickLocation } from "../../util";
import { get } from "svelte/store";
import { currentColor } from "../ColorManager";
import { canvas, canvasBase, ctx, setCanvasPosition, transition, zoom } from "../canvas/Canvas";
import html2canvas from 'html2canvas';
import { mousePos } from "../../store";

const eyeDropper = new EyeDropper();

export class ToolID {
    public static MOVE_TOOL = "MOVE_TOOL"
    public static PENCIL_TOOL = "PENCIL_TOOL"
    public static CROP_TOOL = "CROP_TOOL"
    public static PAINT_BUCKET_TOOL = "PAINT_BUCKET_TOOL"
    public static EYEDROPPER_TOOL = "EYEDROPPER_TOOL"
    public static ROTATE_TOOL = "ROTATE_TOOL"
}

export class Tool {
    getCursor: Function
    onmousemove: Function
    onmousedown: Function
    onmouseup: Function
    onkeydown: Function
    onkeyup:Function
    constructor(public type: string) {};
}

export class MoveTool extends Tool {
    constructor() {super(ToolID.MOVE_TOOL)}
    onmousedown = (e) => {
        transition.set(false);
        const imagepos = [parseFloat(get(canvas).style.left.slice(0,-1)),parseFloat(get(canvas).style.top.slice(0,-1))]

        let percentageX = e.movementX * 100 / get(canvasBase).clientWidth;
        let percentageY = e.movementY * 100 / get(canvasBase).clientHeight;

        setCanvasPosition(imagepos[0] + percentageX,imagepos[1] + percentageY);
    }
}

export class PencilTool extends Tool {
    constructor() {super(ToolID.PENCIL_TOOL)}
    onmousedown = (e) => {
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

export class EyedropperTool extends Tool {
    constructor() {super(ToolID.EYEDROPPER_TOOL)}
    onmousedown = async (e) => {
        // altfel, metoda babeasca
        console.warn("test!!!")
        const result = await eyeDropper.open();

        console.log(result.sRGBHex);

        // let canvas = await html2canvas(document.body, {width:1, height:1, x:get(mousePos)[0],y:get(mousePos)[1]});
        // var ctx = canvas.getContext('2d');
        // console.log(ctx.getImageData(get(mousePos)[0],get(mousePos)[1],1,1).data)
    }
}


export class ToolType {
    public static MOVE_TOOL = new ToolType(ToolID.MOVE_TOOL, new MoveTool(), "tools/move.svg");
    public static PENCIL_TOOL = new ToolType(ToolID.PENCIL_TOOL, new PencilTool(), "tools/pencil.svg");
    public static CROP_TOOL = new ToolType(ToolID.CROP_TOOL, new PencilTool(), "tools/crop.svg");
    public static PAINT_BUCKET_TOOL = new ToolType(ToolID.PAINT_BUCKET_TOOL, new PencilTool(), "tools/paint_bucket.svg");
    public static EYEDROPPER_TOOL = new ToolType(ToolID.EYEDROPPER_TOOL, new EyedropperTool(), "tools/eyedropper.svg");
    public static ROTATE_TOOL = new ToolType(ToolID.ROTATE_TOOL, new PencilTool(), "tools/rotate.svg");
    constructor(public type:string, public tool:Tool, public icon:string) {}
}





