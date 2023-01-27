import { getClickLocation } from "../../util";
import { get } from "svelte/store";
import { canvas, canvasBase, ctx, setCanvasPosition, transition, zoom } from "../canvas/Canvas";
import { colorTarget } from "../../store";
import { Color } from "../Color";


export class ToolID {
    public static MOVE_TOOL = "MOVE_TOOL"
    public static PENCIL_TOOL = "PENCIL_TOOL"
    public static CROP_TOOL = "CROP_TOOL"
    public static PAINT_BUCKET_TOOL = "PAINT_BUCKET_TOOL"
    public static EYEDROPPER_TOOL = "EYEDROPPER_TOOL"
    public static ROTATE_TOOL = "ROTATE_TOOL"
}

export class Tool {
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



export class EyedropperTool extends Tool {
    constructor() {super(ToolID.EYEDROPPER_TOOL)}
    onmousedown = async (e) => {
        const location = getClickLocation(get(canvas), e);
        const clickedColor = get(ctx).getImageData(location.x/get(zoom), location.y/get(zoom), 1, 1).data;
        console.log(clickedColor)
        colorTarget.update(_n => {
            return new Color(clickedColor[0], clickedColor[1], clickedColor[2]).asHSV();
        });
    }
}








