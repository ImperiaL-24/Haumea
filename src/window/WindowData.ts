import type { TabType } from "./TabType";


export default class WindowData {
    //position
    public x: number=0;
    public y: number=0;
    // uuid
    public readonly id: string;
    // all the tabs currently on the window;
    public tabs: TabType[];
    // id of the selected tab from tabs;
    public selectedTab = 0;
    // if it is hovered for merging 2 windows;
    public hovered: boolean = false;
    // if it is moving
    public moving: boolean = false;
    constructor(_id: string, ..._tabs: TabType[]) {
        this.id = _id;
        this.tabs=_tabs;
    }
}