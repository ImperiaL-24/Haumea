import type { TabType } from "./TabType";


export default class WindowData {
    //position
    public x: number=100;
    public y: number=100;

    //size
    public height: number = 300;
    public width: number = 400;

    //if it is tabless
    public tabless = false;
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

    constructor(_id: string, _tabless: boolean, ..._tabs: TabType[]) {
        this.id = _id;
        this.tabs=_tabs;
        this.tabless = _tabless;
    }
}