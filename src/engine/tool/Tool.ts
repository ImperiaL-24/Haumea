
import { App } from "src/haumea/tab";
import { get } from "svelte/store";
import { getCanvasPosition, setCanvasPosition, transition } from "../../haumea/preview";
import { clickState } from "../../store";
import { ToolType } from "./ToolManager";

export class Tool {
    public type: ToolType
    onmousemove: Function = () => {};
    onmousedown: Function = () => {};
    onmouseup: Function = () => {};
    onkeydown: Function = () => {};
    onkeyup:Function = () => {};
    onwheel: Function = () => {};
    constructor(type: ToolType) {
        this.type = type
    };
}

export class CursorTool extends Tool {
    constructor() {super(ToolType.CURSOR_TOOL)}
    onmousedown = (e) => {
        transition.set(false);
    }
    onmousemove = () => {
        if(!get(clickState).leftClick) return;
        transition.set(false);
        setCanvasPosition(getCanvasPosition().add(get(clickState).delta).asPixelPos());
    }
    onwheel = (e) => {
        App.activeCanvas.zoomBy(e.deltaY);
    }
}
