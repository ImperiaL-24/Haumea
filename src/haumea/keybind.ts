import { ModifierState, modifierState, unfocusNavbar } from "../store";
import { get } from "svelte/store";
import { currentTool, ToolType } from "../engine/tool/ToolManager";
import { currentTab, openFile, openTab, ProjectTab, ProjectTabType } from "./tab";

class Keybind {
    key: string
    modifiers: ModifierState

    constructor(key: string, modifiers?: ModifierState) {
        this.key = key;

        this.modifiers = modifiers;
    }
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
        get(currentTab).canvasData.undo();
    }, new Keybind("z", ModifierState.new(false, false, true)), "icons/rotate-left.svg")

    static REDO = new Action("Redo", () => {
        get(currentTab).canvasData.redo();
    }, new Keybind("z", ModifierState.new(true, false, true)), "icons/rotate-right.svg")

    static RELOAD = new Action("Reload - DEV", () => {
        location.reload();
    }, new Keybind("r", ModifierState.new(false, false, true)), "icons/refresh.svg")

    static PENCIL_TOOL = new Action("Pencil Tool", () => {
        currentTool.set(ToolType.PENCIL_TOOL.tool);
    }, new Keybind("b", ModifierState.new(false, false, false)))

    static PENCIL_TOOL_SIZE_INC = new Action("Pencil Tool Brush Size Increase", () => {
        if(get(currentTool).type==ToolType.PENCIL_TOOL.type)
        get(currentTool).updateSize((n) => n+1);
    }, new Keybind("w", ModifierState.new(false, false, false)))

    static PENCIL_TOOL_SIZE_DEC = new Action("Pencil Tool Brush Size Decrease", () => {
        if(get(currentTool).type==ToolType.PENCIL_TOOL.type)
        get(currentTool).updateSize((n) => n>1 ? n-1 : n);
    }, new Keybind("s", ModifierState.new(false, false, false)))

    static MOVE_TOOL = new Action("Move Tool", () => {
        currentTool.set(ToolType.MOVE_TOOL.tool);
    }, new Keybind("v", ModifierState.new(false, false, false)))

    static NEW_TAB = new Action("New", () => {
        openTab(new ProjectTab(ProjectTabType.IMAGE, "NEW TAB!")); 
        unfocusNavbar()
    }, new Keybind("n", ModifierState.new(false, false, true)), "icons/add-document.svg")

    static OPEN = new Action("Open", () => {
        openFile()
    }, new Keybind("o", ModifierState.new(false, false, true)), "icons/add.svg")
    // TODO: SAVE, SAVE AS, EXPORT, EXPORT AS ACTIONS
    static SAVE = new Action("Save", () => {
        get(currentTab).canvasData?.saveData();
    }, new Keybind("s", ModifierState.new(false, false, true)), "icons/disk.svg")
}

const actions = [
    Action.UNDO,
    Action.REDO,
    Action.RELOAD,
    Action.PENCIL_TOOL,
    Action.MOVE_TOOL,
    Action.NEW_TAB,
    Action.OPEN,
    Action.PENCIL_TOOL_SIZE_INC,
    Action.PENCIL_TOOL_SIZE_DEC,
    Action.SAVE
]

export let processKey = (e): void => {
    for(const action of actions) {
        if(action.keybind.matches(e.key, get(modifierState))) {
            action.run();
            return;
        }
    }
}