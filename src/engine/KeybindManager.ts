import { get } from "svelte/store";
import { currentTool, ToolType } from "./tool/ToolManager";

export let processKey = (e): void => {
    get(currentTool).onkeydown(e);
    switch(e.key) {
        case 'b': currentTool.set(ToolType.PENCIL_TOOL.tool); break;
        case 'v': currentTool.set(ToolType.MOVE_TOOL.tool); break;
    }
}