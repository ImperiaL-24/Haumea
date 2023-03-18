
import { get } from "svelte/store";
import { getCanvasPosition, setCanvasPosition, transition } from "../../haumea/preview";
import { clickState } from "../../store";

export class ToolID {
    public static MOVE_TOOL = "MOVE_TOOL"
    public static PENCIL_TOOL = "PENCIL_TOOL"
    public static ERASER_TOOL = "ERASER_TOOL"
    public static CROP_TOOL = "CROP_TOOL"
    public static PAINT_BUCKET_TOOL = "PAINT_BUCKET_TOOL"
    public static EYEDROPPER_TOOL = "EYEDROPPER_TOOL"
    public static ROTATE_TOOL = "ROTATE_TOOL"
}

export class Tool {
    onmousemove: Function = () => {};
    onmousedown: Function = () => {};
    onmouseup: Function = () => {};
    onkeydown: Function = () => {};
    onkeyup:Function = () => {};
    constructor(public type: string) {};
}

export class MoveTool extends Tool {
    constructor() {super(ToolID.MOVE_TOOL)}
    onmousedown = (e) => {
        transition.set(false);
    }
    onmousemove = () => {
        if(!get(clickState).leftClick) return;
        transition.set(false);
        setCanvasPosition(getCanvasPosition().add(get(clickState).delta).asPixelPos());
    }
}
