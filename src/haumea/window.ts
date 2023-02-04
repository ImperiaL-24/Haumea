import {v4 as uuidv4} from "uuid";
import { Vector2 } from "haumea/math";
import { derived, writable, type Writable } from "svelte/store";

// WINDOW STORES
export let indexCount = writable(10)
export let currentWindowId = writable("")
export let windows: Writable<Map<string,WindowData>> = writable(new Map());

export let currentWindow = derived([windows, currentWindowId], ([$windows, $currentWindowId]) => $windows.get($currentWindowId));

export let addWindow = (window: WindowData) => {
    windows.update(n => {
        n.set(window.id, window);
        return n;
    });
}

export let removeWindow = (window: WindowData) => {
    windows.update(n => {
        n.delete(window.id);
        return n;
    })
}

export enum TabId {
    ColorSelector,
    Test,
    Toolbar,
    Layers
}

export class TabType {
    public static ColorSelector = new TabType(TabId.ColorSelector,"Color")
    public static Test = new TabType(TabId.Test,"Test")
    public static Toolbar = new TabType(TabId.Toolbar,"Toolbar")
    public static Layers = new TabType(TabId.Layers,"Layers")
    constructor(public type:TabId, public title:string) {}
}

export class WindowData {
    //position
    public position: Vector2 = new Vector2(100,100);

    //sizeS
    public height: number = 300;
    public width: number = 400;

    public anchored:boolean = false;

    //if it can hold more than 1 tab
    public tabbed = false;
    //if it is resizeable
    public resizeable = true;
    // uuid
    public readonly id: string;
    // all the tabs currently on the window;
    public tabs: TabType[];
    // id of the selected tab from tabs;
    public selectedTab = 0;
    // if it is hovered by another window;
    public hovered: boolean = false;
    // if it is hovering by another window;
    public hovering: boolean = false;
    // if it is moving
    public moving: boolean = false;

    public resizing: "n" | "e" | "s" | "w" | "ne" | "nw" | "se" | "sw" | "none" = "none";

    constructor(_id: string, _tabbed: boolean, ..._tabs: TabType[]) {
        this.id = _id;
        this.tabs=_tabs;
        this.tabbed = _tabbed;
    }
}

export class WindowBuilder {
    private window: WindowData;
    constructor(...tabs: TabType[]) {
        const id = uuidv4();
        this.window = new WindowData(id,false, ...tabs);
    }
    tabbed(value: boolean): WindowBuilder {
        this.window.tabbed = value;
        return this;
    }
    resizeable(value: boolean): WindowBuilder {
        this.window.resizeable = value;
        return this;
    }
    tabs(...tabs: TabType[]): WindowBuilder {
        this.window.tabs.push(...tabs);
        return this;
    }
    position(pos:Vector2): WindowBuilder  {
        this.window.position = pos;
        return this;
    }
    size(width: number, height: number): WindowBuilder {
        this.window.width = width;
        this.window.height = height;
        return this;
    }
    build(): WindowData {
        return this.window;
    }
}