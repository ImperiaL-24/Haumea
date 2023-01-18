export class Tool {
    onclick: Function
}

export class MoveTool extends Tool {
    onclick = (e) => {
        console.log("Gold Please!");
    }
}

export class PencilTool extends Tool {
    onclick = (e) => {
        if(e.altKey) console.log("Food Please!");
        else console.log("Stone Please!");
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

