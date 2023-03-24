import { writable, type Writable } from "svelte/store";
import { EraserTool } from "./EraserTool";
import { EyedropperTool } from "./EyedropperTool";
import { MoveTool } from "./MoveTool";
import { PencilTool } from "./PencilTool";
import { CursorTool, type Tool } from "./Tool";


export class ToolType {
    public static CURSOR_TOOL = new ToolType("CURSOR_TOOL", new CursorTool(), "tools/cursor.svg");
    public static MOVE_TOOL = new ToolType("MOVE_TOOL", new MoveTool(), "tools/move.svg");
    public static PENCIL_TOOL = new ToolType("PENCIL_TOOL", new PencilTool(), "tools/pencil.svg");
    public static ERASER_TOOL = new ToolType("ERASER_TOOL", new EraserTool(), "tools/eraser_tool.svg");
    public static CROP_TOOL = new ToolType("CROP_TOOL", new PencilTool(), "tools/crop.svg");
    public static PAINT_BUCKET_TOOL = new ToolType("PAINT_BUCKET_TOOL", new PencilTool(), "tools/paint_bucket.svg");
    public static EYEDROPPER_TOOL = new ToolType("EYEDROPPER_TOOL", new EyedropperTool(), "tools/eyedropper.svg");
    public static ROTATE_TOOL = new ToolType("ROTATE_TOOL", new PencilTool(), "tools/rotate.svg");
    constructor(public type:string, public tool:Tool, public icon:string) {}
}

export let currentTool: Writable<Tool> = writable(ToolType.PENCIL_TOOL.tool);