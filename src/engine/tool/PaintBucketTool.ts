import { canvasShadow, getCanvasPosition, setCanvasPosition } from "src/haumea/preview";
import { App } from "src/haumea/tab";
import { getClickLocation } from "src/util";
import { get } from "svelte/store";
import { Tool } from "./Tool";
import { Color } from "src/haumea/color";
import { colorTarget, modifierState } from "src/store";
import { Vector2 } from "src/haumea/math";
import { EyedropperTool } from "./EyedropperTool";

export class PaintBucketTool extends Tool {
    eyedropper: EyedropperTool = new EyedropperTool();
    constructor() {super("PAINT_BUCKET_TOOL")}
    onmousedown = () => {
        if(get(modifierState).altKey) return this.eyedropper.onmousedown();

        console.log("click!");
        const zoom  = App.activeCanvas.zoom;
        const layer = App.activeCanvas.activeState.activeLayer;
        const location = getClickLocation(get(canvasShadow)).product(1/zoom);
        const pixelColor = layer.getPixelColor(location).asRGB();
        const newColor = Color.newFromHSV(...get(colorTarget)).asRGB();
        const imageData = layer.getImageData();
        console.log(pixelColor, newColor)
        for (var i=0;i<imageData.data.length;i+=4) {
            // is this pixel the old rgb?
            if(imageData.data[i]==pixelColor[0] &&
                imageData.data[i+1]==pixelColor[1] &&
                imageData.data[i+2]==pixelColor[2]
            ){
                // change to your new rgb
                imageData.data[i]=newColor[0];
                imageData.data[i+1]=newColor[1];
                imageData.data[i+2]=newColor[2];
                imageData.data[i+3]=255;
            }
        }
        layer.ctx.putImageData(imageData,0,0);
        console.log(imageData.data[0]);
        layer.layerChange.signal();
    }
    onmousemove = () => {
        if(get(modifierState).altKey) return this.eyedropper.onmousemove();
    }
    onmouseup = () => {
        if(get(modifierState).altKey) return this.eyedropper.onmouseup();
    }
    onwheel = (e) => {
        if(get(modifierState).altKey) {
            App.activeCanvas.zoomBy(e.deltaY);
            return;
        }
        //TODO: Eraser TOOl and this maybe have transition to true?
        let delta = e.deltaY > 0 ? -50*App.activeCanvas.zoom/100-10 : 50*App.activeCanvas.zoom/100+10;
        let distance: Vector2 = get(modifierState).ctrlKey ? new Vector2(delta, 0) : new Vector2(0, delta);
        setCanvasPosition(getCanvasPosition().add(distance).asPixelPos());
    }
}