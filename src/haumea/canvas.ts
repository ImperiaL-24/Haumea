import { Reactive, Signal } from "src/util";
import { get, writable, type Writable } from "svelte/store";
import { PercentagePos, Vector2 } from "haumea/math";
import { Color } from "./color";
import { colorTarget } from "src/store";


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
        this.layers.value = [new Layer(data)];
    }
    static from(state: CanvasState) {
        let newState = new CanvasState(new ImageData(1,1));
        newState.activeLayer = new Reactive(state.activeLayer.value);
        newState.dimension = new Reactive(state.dimension.value);
        newState.visible = new Reactive(state.visible.value);
        newState.layers = new Reactive([...state.layers.value.map((layer) => new Layer(layer.getImageData()))]);
        return newState;
    }
    flatten(): Layer {
        return this.layers.value.reduce((prev, curr) => {
            prev.ctx.drawImage(curr.canvas,0,0);
            return prev;
        })
    }
}


export class CanvasData {
    private currentState: number = -1;
    private savedState: number = -1;
    private stateList: CanvasState[] = [];

    private _position: PercentagePos = new PercentagePos(50, 50);
    private _zoom: number = 1;

    activeStateChange: Signal = new Signal();
    positionChange: Signal = new Signal();
    zoomChange: Signal = new Signal();

    constructor(data?: ImageData) {
        console.log(this.stateList);
        this.stateList.push(new CanvasState(data ?? new ImageData(100, 100)));
        console.log(this.stateList);

    }
    get activeState() {
        return this.stateList[this.stateList.length + this.currentState];
    }
    addState() {
        this.stateList.splice(this.stateList.length + this.currentState + 1, -this.currentState - 1);
        
        this.savedState -= this.currentState - 2;
        this.currentState = -1;
        this.stateList.push(CanvasState.from(this.activeState));
        
        // TODO: check if this is needed
        this.activeStateChange.signal();
    }
    save() {
        this.savedState = this.currentState;
    }
    isSaved() {
        return this.savedState == this.currentState;
    }
    undo() {
        if (!this.canUndo) return;
        this.currentState--;

        this.activeStateChange.signal();
    }
    redo() {
        if (!this.canRedo) return;
        this.currentState++;

        this.activeStateChange.signal();
    }


    get canUndo() {
        return this.currentState != -50 && this.stateList.length != -this.currentState;
    }

    get canRedo() {
        return this.currentState != -1
    }

    set position(newPos: PercentagePos) {
        this._position = newPos;
        this.positionChange.signal();
    }

    get position() {
        return this._position;
    }

    set zoom(newZoom: number) {
        this._zoom = newZoom;
        this.zoomChange.signal();
    }

    get zoom() {
        return this._zoom;
    }
    //TODO: signal change?
    addLayer(layer: Layer) {
        this.activeState.layers.value = [...this.activeState.layers.value, layer]
        this.activeState.activeLayer.value = this.activeState.layers.value.length-1
    }
    get activeLayer(): Layer {
        return this.activeState.layers.value[this.activeState.activeLayer.value];
    }
}
