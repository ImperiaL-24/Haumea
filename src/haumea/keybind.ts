import { modifierState } from "../store";
import { get } from "svelte/store";
import { redo, undo } from "../engine/canvas/UndoManager";
import { currentTool, ToolType } from "../engine/tool/ToolManager";

export let processKey = (e): void => {

    if(e.key.toLowerCase() == "z" && get(modifierState).ctrlKey) {
        console.log(get(modifierState).shiftKey);
        if(!get(modifierState).shiftKey) {
            undo();
        } else {
            redo();
        }
        
    }
    if(e.key.toLowerCase() == "r" && get(modifierState).ctrlKey) {
        location.reload()
        
    }
    switch(e.key) {
        case 'b': currentTool.set(ToolType.PENCIL_TOOL.tool); break;
        case 'v': currentTool.set(ToolType.MOVE_TOOL.tool); break;
    }
}