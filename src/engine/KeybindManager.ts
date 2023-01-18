import { ToolType } from "./tool/Tool";
import { currentTool } from "./tool/ToolManager";

export let processKey = (e): void => {
    switch(e.key) {
        case 'b': currentTool.set(ToolType.PENCIL_TOOL.tool); break;
        case 'v': currentTool.set(ToolType.MOVE_TOOL.tool); break;
    }
}