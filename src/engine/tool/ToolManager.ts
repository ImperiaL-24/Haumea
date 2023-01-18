import { writable, type Writable } from "svelte/store";
import { ToolType, type Tool } from "./Tool";

export let currentTool: Writable<Tool> = writable(ToolType.PENCIL_TOOL.tool);
