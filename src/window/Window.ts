import type { TabType } from "./TabType";
import {v4 as uuidv4} from "uuid";
import { windows } from "../store";
import { Vector2 } from "../engine/Vector2";

export default class Window {
    //position
    public position: Vector2 = new Vector2(100,100);

    //size
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
    private window: Window;
    constructor(...tabs: TabType[]) {
        const id = uuidv4();
        this.window = new Window(id,false, ...tabs);
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
    build(): Window {
        return this.window;
    }
    add(): void {
        windows.update(n => {
            n.set(this.window.id, this.window);
            return n;
        });
    }
}