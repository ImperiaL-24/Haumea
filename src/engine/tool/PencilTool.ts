import { EyedropperTool, Tool, ToolID } from "./Tool";
import { get, writable, type Writable } from "svelte/store";
import { currentColor } from "../ColorManager";
import { getClickLocation } from "../../util";
import { canvas, ctx, zoom } from "../canvas/Canvas";
import { clickState } from "../../store";
import { Vector2 } from "../Vector2";


let draw = (size:number, location: Vector2) => {
    const color = get(currentColor).asRGB();
    
        const pixel = get(ctx).createImageData(size,size);
        let d = pixel.data;
        for(let i = 0;i< pixel.data.length;i+=4) {
            d[i] = color[0];
            d[i+1] = color[1];
            d[i+2] = color[2];
            d[i+3] = 255;    
        }

        let placeLocationX = location.x- (size-1)/2;
        let placeLocationY = location.y - (size-1)/2;

        get(ctx).putImageData(pixel, placeLocationX, placeLocationY)
}

export class PencilTool extends Tool {
    size: Writable<number> = writable(1);
    lastClick: Vector2
    constructor() {super(ToolID.PENCIL_TOOL)}
    onmousedown = (e) => {
        if(e.altKey) return new EyedropperTool().onmousedown(e);
        const location = getClickLocation(get(canvas), e).product(1/get(zoom));
        draw(get(this.size), location);
        this.lastClick = location;
    }
    onmousemove = (e) => {
        if(!get(clickState).leftClick) return;
        const location = getClickLocation(get(canvas), e).product(1/get(zoom));
        console.log(this.lastClick);
        //TODO: LineTo
        for(let i=Math.floor(this.lastClick.x);i<Math.floor(location.x);i++) {
            let distance = (i-Math.floor(this.lastClick.x))/(Math.floor(location.x)-Math.floor(this.lastClick.x))
            console.log(i, (Math.floor(location.x)-Math.floor(this.lastClick.x))*distance+Math.floor(this.lastClick.x));
            draw(get(this.size), new Vector2(i,(Math.floor(location.x)-Math.floor(this.lastClick.x))*distance+Math.floor(this.lastClick.x)));
        }
        this.lastClick = location;
    }
    onkeydown = (e) => {
        console.log("test");
        if(e.key == "w") this.size.set(get(this.size)+1);
        if(e.key == "s") this.size.set(get(this.size)-1);
    };
}