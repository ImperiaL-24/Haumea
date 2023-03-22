import { Vector2 } from "src/haumea/math";
import { canvasShadow, transition } from "src/haumea/preview";
import { App } from "src/haumea/tab";
import { clickState } from "src/store";
import { getClickLocation } from "src/util";
import { get } from "svelte/store";
import { Tool, ToolID } from "./Tool";

export class MoveTool extends Tool {
    private previousLocation: Vector2

    constructor() {super(ToolID.MOVE_TOOL)}
    onmousedown = (e) => {
        transition.set(false);
        const zoom  = App.activeCanvas.zoom;

        this.previousLocation = getClickLocation(get(canvasShadow)).product(1/zoom);
    }
    onmousemove = () => {
        if(!get(clickState).leftClick) return;

        transition.set(false);
        const zoom  = App.activeCanvas.zoom;

        const currentLocation = getClickLocation(get(canvasShadow)).product(1/zoom);

        const delta = currentLocation.add(this.previousLocation.negate());
        console.log(delta);

        if(Math.round(delta.x) != 0) {
            App.activeCanvas.activeState.activeLayer.moveBy(new Vector2(delta.x, 0));
            this.previousLocation.x = currentLocation.x;
        }
        else if(Math.round(delta.y) != 0) {
            App.activeCanvas.activeState.activeLayer.moveBy(new Vector2(0, delta.y));
            this.previousLocation.y = currentLocation.y;
        }

        
    }
}