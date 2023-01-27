import { writable, type Writable } from "svelte/store";
import { PencilTool } from "./PencilTool";
import { EyedropperTool, MoveTool, ToolID, type Tool } from "./Tool";


export class ToolType {
    public static MOVE_TOOL = new ToolType(ToolID.MOVE_TOOL, new MoveTool(), "tools/move.svg");
    public static PENCIL_TOOL = new ToolType(ToolID.PENCIL_TOOL, new PencilTool(), "tools/pencil.svg");
    public static CROP_TOOL = new ToolType(ToolID.CROP_TOOL, new PencilTool(), "tools/crop.svg");
    public static PAINT_BUCKET_TOOL = new ToolType(ToolID.PAINT_BUCKET_TOOL, new PencilTool(), "tools/paint_bucket.svg");
    public static EYEDROPPER_TOOL = new ToolType(ToolID.EYEDROPPER_TOOL, new EyedropperTool(), "tools/eyedropper.svg");
    public static ROTATE_TOOL = new ToolType(ToolID.ROTATE_TOOL, new PencilTool(), "tools/rotate.svg");
    constructor(public type:string, public tool:Tool, public icon:string) {}
}

export let currentTool: Writable<Tool> = writable(ToolType.PENCIL_TOOL.tool);