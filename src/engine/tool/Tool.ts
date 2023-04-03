
export class Tool {
    public type: string
    onmousemove: Function = () => {};
    onmousedown: Function = () => {};
    onmouseup: Function = () => {};
    onkeydown: Function = () => {};
    onkeyup:Function = () => {};
    onwheel: Function = () => {};
    constructor(type: string) {
        this.type = type
    };
}
