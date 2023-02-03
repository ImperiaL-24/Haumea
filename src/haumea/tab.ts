import { getCanvasData, setCanvasData } from "src/haumea/preview";
import { derived, get, writable, type Writable } from "svelte/store";
import {v4 as uuidv4} from "uuid";
import { PercentagePos } from "./math";

export class ProjectTabType {
    static HOME = new ProjectTabType("HOME","svelte.svg");
    static SETTINGS = new ProjectTabType("SETTINGS","icons/settings.svg");
    static IMAGE = new ProjectTabType("IMAGE","icons/picture.svg");
    constructor(public name: string, public icon:string) {}
} 

export class ProjectTab {
    readonly id: string;
    isSaved: boolean;
    type: ProjectTabType;
    tabName: string;
    canvasData?: CanvasImageData;
    constructor(type: ProjectTabType, name: string, data?: CanvasImageData) {
        this.id = uuidv4();
        this.type = type;
        this.tabName = name;
        this.canvasData = data ?? type == ProjectTabType.IMAGE ? new CanvasImageData() : undefined;
    }
    subscribe(subscriber) {
        subscriber(this)
        return () => {}
    }
}

export class CanvasImageData {
    currentState: number = -1;
    stateList: ImageData[] = [];
    position: PercentagePos = new PercentagePos(50,50);
    zoom: number = 1;

    canUndo: Writable<boolean> = writable(false);
    canRedo: Writable<boolean> = writable(false);
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
        this.updateBooleans();
    }
    undo() {
        if(!get(this.canUndo)) return;
        setCanvasData(this.stateList.slice(this.currentState-1)[0]);
        this.currentState--;
        console.log("undo", this.canUndo)
        this.updateBooleans()
    }
    redo() {
        if(!(get(this.canRedo))) return;
            setCanvasData(this.stateList.slice(this.currentState+1)[0]);
            this.currentState++;
            console.log("redo", this.stateList, this.currentState)
            this.updateBooleans()
    }
    private updateBooleans() {
        this.canUndo.set(this.currentState != -50 && this.stateList.length != -this.currentState);
        this.canRedo.set(this.currentState != -1);
    }
}

export const tabs: Writable<Map<string, ProjectTab>> = writable(new Map());
export const currentTabId: Writable<string> = writable();

export const currentTab = derived([tabs, currentTabId], ([$tabs, $currentTabId]) =>$tabs.get($currentTabId));

export let setCurrentTab = (id: string) => {
    currentTabId.set(id);
}

export let openTab = (tab: ProjectTab) => {
    tabs.update(n => {
        n.set(tab.id, tab);
        return n;
    })
    currentTabId.set(tab.id);

}

export let closeTab = (id: string) => {
    //TODO: ARE YOU SURE MODAL IF UNSAVED

    if(get(currentTab).id == id) {
        const keys = Array.from(get(tabs).keys());
        let index = keys.indexOf(id);
        if(index==0 && keys.length==1) return;
        if(index!=0) index--;
        else index++;
        currentTabId.set(keys[index]);
    }
    
    
    tabs.update(n => {
        n.delete(id);
        return n;
    })
    
}