import { getCanvasData, setCanvasData } from "src/engine/canvas/Canvas";
import { derived, get, writable, type Writable } from "svelte/store";
import {v4 as uuidv4} from "uuid";

export class ProjectTabType {
    static HOME = new ProjectTabType("HOME","svelte.svg");
    static SETTINGS = new ProjectTabType("SETTINGS","icons/settings.svg");
    static IMAGE = new ProjectTabType("IMAGE","icons/picture.svg");
    constructor(public name: string, public icon:string) {}
} 

export class ProjectTab {
    readonly id: string;
    type: ProjectTabType;
    tabName: string;
    canvasData?: CanvasImageData;
    constructor(type: ProjectTabType, name: string, data?: CanvasImageData) {
        this.id = uuidv4();
        this.type = type;
        this.tabName = name;
        this.canvasData = data ?? type == ProjectTabType.IMAGE ? new CanvasImageData() : undefined;
    }
}

export class CanvasImageData {
    currentState: number = -1;
    stateList: ImageData[] = [];
    constructor(data?: ImageData) {
        this.stateList.push(data ?? new ImageData(16,16));
    }
    get() {
        return this.stateList[this.stateList.length+this.currentState];
    }
    saveState() {
        this.stateList.splice( this.stateList.length+this.currentState+1, -this.currentState+1);
        this.stateList.push(getCanvasData());

        this.currentState= -1;
    }
    undo() {
        if(this.currentState == -50 || this.stateList.length == -this.currentState) return;
        setCanvasData(this.stateList.slice(this.currentState-1)[0]);
        this.currentState--;
        console.log("undo", this.stateList, this.currentState)
    }
    redo() {
        if(!(this.currentState != -1)) return;
            setCanvasData(this.stateList.slice(this.currentState+1)[0]);
            this.currentState++;
            console.log("redo", this.stateList, this.currentState)
    }
    canUndo() {
        return this.currentState != -50 && this.stateList.length != -this.currentState
    }
}

export const tabs: Writable<Map<string, ProjectTab>> = writable(new Map());
export const currentTabId: Writable<string> = writable();

export const currentTab = derived([tabs, currentTabId], ([$tabs, $currentTabId]) =>$tabs.get($currentTabId));

export let setCurrentTab = (id: string) => {
    currentTabId.set(id);
    const currentTab = get(tabs).get(get(currentTabId));
}

export let openTab = (tab: ProjectTab) => {
    tabs.update(n => {
        n.set(tab.id, tab);
        return n;
    })
    currentTabId.set(tab.id);
    const currentTab = get(tabs).get(get(currentTabId));
}

export let closeTab = (id: string) => {
    tabs.update(n => {
        n.delete(id);
        return n;
    })
}