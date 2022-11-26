import type { TabType } from "./TabType";


export default class WindowData {
    public x: number=0;
    public y: number=0;
    public readonly id: string;
    public tabs: TabType[];
    public selectedTab = 0;
    public hovered: boolean = false;
    public moving: boolean = false;
    constructor(_id: string, ..._tabs: TabType[]) {
        this.id = _id;
        this.tabs=_tabs;
    }
}