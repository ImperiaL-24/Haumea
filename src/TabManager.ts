import { derived, writable, type Readable, type Writable } from "svelte/store";
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
        this.canvasData = data;
    }
}

export const tabs: Writable<Map<string, ProjectTab>> = writable(new Map());
const currentTabId: Writable<string> = writable();

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
    tabs.update(n => {
        n.delete(id);
        return n;
    })
}