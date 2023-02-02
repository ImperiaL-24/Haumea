import {v4 as uuidv4} from "uuid";
import { windows } from 'src/haumea/window'
import { get, writable, type Writable } from "svelte/store";

export class Anchor {
    //position
    public position: "left" | "right" | "bottom" = "right";

    public size: number = 400;

    public anchored:boolean = false;

    //if it is resizeable
    public resizeable = true;

    // uuid
    public readonly id: string;

    public windows: string[];

    constructor(_id: string, ..._windows: string[]) {
        this.id = _id;
        this.windows=_windows;
    }
}

export let anchors: Writable<Map<string,Anchor>> = writable(new Map())

export class AnchorBuilder {
    private anchor: Anchor;
    private staticWidth;
    private staticHeight;
    constructor(..._windows: string[]) {
        const id = uuidv4();
        this.anchor = new Anchor(id, ..._windows);
        for(let window of _windows) {
            console.log(window)
            let data = get(windows).get(window);
            if(!data.resizeable) {
                this.anchor = new Anchor(id, window);
                this.anchor.resizeable = false;
                this.staticHeight = data.height;
                this.staticWidth = data.width;
                console.log(data.width);
                break;
            }
        }
    }
    position(position: "left" | "right" | "bottom"): AnchorBuilder {
        this.anchor.position = position;
        return this;
    }
    resizeable(value: boolean): AnchorBuilder {
        this.anchor.resizeable = value;
        return this;
    }
    windows(...tabs: string[]): AnchorBuilder {
        this.anchor.windows.push(...tabs);
        return this;
    }
    size(size: number): AnchorBuilder {
        this.anchor.size = size;
        return this;
    }
    build(): Anchor {
        if(!this.anchor.resizeable) {
            this.anchor.size = this.anchor.position == "bottom" ? this.staticHeight : this.staticWidth;
        }
        return this.anchor;
    }
    add(): void {
        if(!this.anchor.resizeable) {
            this.anchor.size = this.anchor.position == "bottom" ? this.staticHeight : this.staticWidth;
        }
        anchors.update(n => {
            n.set(this.anchor.id, this.anchor);
            return n;
        });
    }
}