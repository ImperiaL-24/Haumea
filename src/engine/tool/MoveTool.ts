import { transition } from "src/haumea/preview";
import { clickState } from "src/store";
import { get } from "svelte/store";
import { Tool, ToolID } from "./Tool";

export class MoveTool extends Tool {
    constructor() {super(ToolID.MOVE_TOOL)}
    onmousedown = (e) => {
        transition.set(false);
    }
    onmousemove = () => {
        if(!get(clickState).leftClick) return;
        transition.set(false);
        get(clickState).delta
    }
}