export enum TabId {
    ColorSelector,
    Test,
    Toolbar
}

export class TabType {
    public static ColorSelector = new TabType(TabId.ColorSelector,"Color")
    public static Test = new TabType(TabId.Test,"Test")
    public static Toolbar = new TabType(TabId.Toolbar,"Toolbar")
    constructor(public type:TabId, public title:string) {}
}

