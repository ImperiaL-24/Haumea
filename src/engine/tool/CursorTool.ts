import { getCanvasPosition, setCanvasPosition, transition } from "src/haumea/preview";
import { App } from "src/haumea/tab";
import { clickState } from "src/store";
import { get } from "svelte/store";
import { Tool } from "./Tool";
import { ToolType } from "./ToolManager";

export class CursorTool extends Tool {
    constructor() {super("CURSOR_TOOL")}
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