import { ModifierState, modifierState, unfocusNavbar } from "../store";
import { get } from "svelte/store";
import { currentTool, ToolType } from "../engine/tool/ToolManager";
import { App, CanvasProjectTab } from "./tab";
import { Vector2 } from "./math";
import { Modal, activeModal } from "./modal";

class Keybind {
    key: string
    modifiers: ModifierState

    constructor(key: string, modifiers: ModifierState) {
        this.key = key;

        this.modifiers = modifiers;
    }
    static from(keybind:string) {
        keybind = keybind.toLowerCase();
        return new Keybind(keybind.match(/\w(?!.*\+)/)[0], ModifierState.new(keybind.includes("shift+"), keybind.includes("alt+"), keybind.includes("ctrl+")))
    }
    static NONE = new Keybind("", new ModifierState());
    matches(key: string, modifiers: ModifierState) {
        return this.key == key.toLowerCase() && this.modifiers.equals(modifiers);
    }
    toString() {
        let output = "";
        if(this.modifiers.ctrlKey) output += "Ctrl+";
        if(this.modifiers.altKey) output += "Alt+";
        if(this.modifiers.shiftKey) output += "Shift+";
        output += this.key.toUpperCase();
        return output;
    }
}

export class Action {
    name: string
    action: Function
    keybind: Keybind
    icon: string
    run() {
        this.action();
    }
    constructor(name: string, action: Function, keybind: Keybind, icon?: string) {
        this.name = name;
        this.action = action;
        this.keybind = keybind;
        this.icon = icon;
    }
    
    static UNDO = new Action("Undo", () => {
        App.activeCanvas.undo();
    }, Keybind.from("Ctrl+Z"), "icons/rotate-left.svg")

    static REDO = new Action("Redo", () => {
        App.activeCanvas.redo();
    }, Keybind.from("Ctrl+Shift+Z"), "icons/rotate-right.svg")

    static RELOAD = new Action("Reload - DEV", () => {
        location.reload();
    }, Keybind.from("Ctrl+R"), "icons/refresh.svg")

    static PENCIL_TOOL = new Action("Pencil Tool", () => {
        currentTool.set(ToolType.PENCIL_TOOL.tool);
    }, Keybind.from("B"))

    static ERASER_TOOL = new Action("Eraser Tool", () => {
        currentTool.set(ToolType.ERASER_TOOL.tool);
    }, Keybind.from("E"))

    static PENCIL_TOOL_SIZE_INC = new Action("Pencil Tool Brush Size Increase", () => {
        if(get(currentTool).type==ToolType.PENCIL_TOOL.type)
        get(currentTool).updateSize((n) => n+1);
    }, Keybind.from("W"))

    static PENCIL_TOOL_SIZE_DEC = new Action("Pencil Tool Brush Size Decrease", () => {
        if(get(currentTool).type==ToolType.PENCIL_TOOL.type)
        get(currentTool).updateSize((n) => n>1 ? n-1 : n);
    }, Keybind.from("S"))

    static CURSOR_TOOL = new Action("Cursor Tool", () => {
        currentTool.set(ToolType.CURSOR_TOOL.tool);
    }, Keybind.from("A"))

    static MOVE_TOOL = new Action("Move Tool", () => {
        currentTool.set(ToolType.MOVE_TOOL.tool);
    }, Keybind.from("V"))

    static NEW_TAB = new Action("New", () => {
        // App.openTab(new CanvasProjectTab()); 
        // unfocusNavbar()
        activeModal.set(Modal.NEW_PROJECT);
    }, Keybind.from("Ctrl+N"), "icons/add-document.svg")

    static OPEN = new Action("Open", () => {
        App.openFile()
    }, Keybind.from("Ctrl+O"), "icons/add.svg")

    static IMPORT = new Action("Import", () => {
        App.openProject()
    }, Keybind.NONE, "icons/add.svg")

    static SAVE = new Action("Save", () => {
        App.activeCanvas.saveData();
    }, Keybind.from("Ctrl+S"), "icons/disk.svg")

    static EXPORT = new Action("Export", () => {
        App.activeCanvas.exportData();
    }, Keybind.from("Ctrl+SHIFT+Q"), "icons/file-export.svg")

    static TEST = new Action("Test", () => {
        console.warn("TEST ACTION RUN!")
        App.activeCanvas.activeState.activeLayer.moveBy(new Vector2(10,10));
    }, Keybind.from("Ctrl+X"), "icons/file-export.svg")
}

const actions = [
    Action.UNDO,
    Action.REDO,
    Action.RELOAD,
    Action.PENCIL_TOOL,
    Action.ERASER_TOOL,
    Action.CURSOR_TOOL,
    Action.MOVE_TOOL,
    Action.NEW_TAB,
    Action.OPEN,
    Action.IMPORT,
    Action.PENCIL_TOOL_SIZE_INC,
    Action.PENCIL_TOOL_SIZE_DEC,
    Action.SAVE,
    Action.EXPORT,
    Action.TEST
]

export let processKey = (e): void => {
    for(const action of actions) {
        if(action.keybind.matches(e.key, get(modifierState))) {
            action.run();
            return;
        }
    }
}