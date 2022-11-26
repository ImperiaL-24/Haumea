export enum TabId {
    ColorSelector,
    Test
}

export class TabType {
    public static ColorSelector = new TabType(TabId.ColorSelector,"Color")
    public static Test = new TabType(TabId.Test,"Test")
    constructor(public type:TabId, public title:string) {}
}

