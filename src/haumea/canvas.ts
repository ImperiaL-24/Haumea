import { getCanvasState } from "haumea/preview";
import { Reactive, Signal } from "src/util";
import { get, writable, type Writable } from "svelte/store";
import { PercentagePos, Vector2 } from "haumea/math";
import { Color } from "./color";
import { colorTarget } from "src/store";

export let stateChange: Signal = new Signal();

export class Layer {
    canvas: OffscreenCanvas;
    ctx: OffscreenCanvasRenderingContext2D;
    layerChange: Signal = new Signal();
    constructor(data: ImageData) {
        this.canvas = new OffscreenCanvas(data.width, data.height);
        this.ctx = this.canvas.getContext("2d") as OffscreenCanvasRenderingContext2D;
        this.ctx.putImageData(data, 0, 0);
    }
    drawTo(position: Vector2, size: number, silent:boolean = false) {
        const color = Color.newFromHSV(...get(colorTarget)).asRGB();
        const pixel = new ImageData(size,size);
        let d = pixel.data;
        for(let i = 0;i< pixel.data.length;i+=4) {
            d[i] = color[0];
            d[i+1] = color[1];
            d[i+2] = color[2];
            d[i+3] = 255;    
        }
        const pos = position.addScalar(-(size-1)/2);
        this.ctx.putImageData(pixel, pos.x, pos.y);
        if(!silent) this.layerChange.signal();
    }
    line(from: Vector2, to: Vector2, size: number) {
        const pixelDistance = to.floor().add(from.floor().negate()).abs().maxCoord();
        if(pixelDistance==0) return;
        for(let i=1;i<=pixelDistance;i++) {
            this.drawTo(from.lerp(to, i/pixelDistance), size, true);
        }
        this.layerChange.signal();
    }
    getImageData() {
        return this.ctx.getImageData(0,0, this.canvas.width, this.canvas.height);
    }
}

export class CanvasState {
    layers: Reactive<Layer[]> = new Reactive([]);
    activeLayer: Reactive<number> = new Reactive(0);
    dimension: Reactive<Vector2> = new Reactive(new Vector2(100,100));
    visible: Reactive<boolean> = new Reactive(true);
    constructor(data: ImageData) {
        this.dimension.value = new Vector2(data.width, data.height);
        this.addLayer(new Layer(data));
    }
    static from(state: CanvasState) {
        let newState = new CanvasState(new ImageData(1,1));
        newState.activeLayer = new Reactive(state.activeLayer.value);
        newState.dimension = new Reactive(state.dimension.value);
        newState.visible = new Reactive(state.visible.value);
        newState.layers = new Reactive([...state.layers.value.map((layer) => new Layer(layer.getImageData()))]);
        return newState;
    }
    addLayer(layer: Layer) {
        this.layers.value = [...this.layers.value, layer]
        this.activeLayer.value = this.layers.value.length-1
    }
    getCurrentLayer(): Layer {
        return this.layers.value[this.activeLayer.value];
    }
}


export class CanvasData {
    currentState: Reactive<number> = new Reactive(-1);
    stateList: Reactive<CanvasState[]> = new Reactive([]);

    position: Reactive<PercentagePos> = new Reactive(new PercentagePos(50, 50));
    zoom: Reactive<number> = new Reactive(1);

    canUndo: Writable<boolean> = writable(false);
    canRedo: Writable<boolean> = writable(false);
    constructor(data?: ImageData) {
        console.log(this.stateList.value);
        this.stateList.value.push(new CanvasState(data ?? new ImageData(100, 100)));
        console.log(this.stateList.value);

    }
    get() {
        return this.stateList.value[this.stateList.value.length + this.currentState.value];
        
    }
    saveState() {
        this.stateList.value.splice(this.stateList.value.length + this.currentState.value + 1, -this.currentState.value - 1);
        this.currentState.value = -1;
        this.stateList.value.push(CanvasState.from(getCanvasState()));
        console.log("SAVE STATE", this.stateList.value)
        
        this.updateBooleans();
        stateChange.signal();
    }
    undo() {
        if (!get(this.canUndo))
            return;
        // setCanvasState(this.stateList.value.slice(this.currentState.value - 1)[0]);
        this.currentState.value = this.currentState.value-1;
        console.log("undo", this.stateList, this.currentState);
        this.updateBooleans();
        stateChange.signal();
    }
    redo() {
        if (!(get(this.canRedo)))
            return;
        // setCanvasState(this.stateList.value.slice(this.currentState.value + 1)[0]);
        this.currentState.value = this.currentState.value+1;
        console.log("redo", this.stateList, this.currentState);
        this.updateBooleans();
        stateChange.signal();
    }
    private updateBooleans() {
        this.canUndo.set(this.currentState.value != -50 && this.stateList.value.length != -this.currentState.value);
        this.canRedo.set(this.currentState.value != -1);
        
    }
}
