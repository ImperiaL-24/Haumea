import { blobToBase64, Signal } from "src/util";
import { Vector2 } from "haumea/math";
import type { CanvasProjectTab } from "./tab";
import type { Brush } from "./tool/tool";

export class Layer {
    canvas: OffscreenCanvas;
    ctx: OffscreenCanvasRenderingContext2D;
    private _visible: boolean = true;

    visibilityChange: Signal = new Signal();
    layerChange: Signal = new Signal();

    constructor(data: ImageData, visible?: boolean) {
        this.canvas = new OffscreenCanvas(data.width, data.height);
        this.ctx = this.canvas.getContext("2d") as OffscreenCanvasRenderingContext2D;
        this.ctx.putImageData(data, 0, 0);
        this._visible = visible;
    }
    set visible(visible: boolean) {
        this._visible = visible;
        this.visibilityChange.signal();
    }
    get visible() {
        return this._visible;
    }
    drawTo(position: Vector2, brush: Brush, silent:boolean = false) {
        const color = brush.color.asRGB();
        const pixel = new ImageData(brush.size,brush.size);
        let d = pixel.data;
        for(let i = 0;i< pixel.data.length;i+=4) {
            d[i] = color[0];
            d[i+1] = color[1];
            d[i+2] = color[2];
            d[i+3] = brush.opacity;    
        }
        const pos = position.addScalar(-(brush.size-1)/2);
        this.ctx.putImageData(pixel, pos.x, pos.y);
        if(!silent) this.layerChange.signal();
    }
    line(from: Vector2, to: Vector2, brush: Brush) {
        const pixelDistance = to.floor().add(from.floor().negate()).abs().maxCoord();
        if(pixelDistance==0) return;
        for(let i=1;i<=pixelDistance;i++) {
            this.drawTo(from.lerp(to, i/pixelDistance), brush, true);
        }
        this.layerChange.signal();
    }
    getImageData() {
        return this.ctx.getImageData(0,0, this.canvas.width, this.canvas.height);
    }
    async asJSON() {
        const dataBlob: Blob = await this.canvas.convertToBlob();
        return {
            visible: this._visible,
            data: await blobToBase64(dataBlob)
        }
    }
    static async fromJSON(json: {visible:boolean, data:string}) {
        var image = new Image();
        image.src = json.data;
        await image.decode();
    
        //convert image to canvas
        let canvas = document.createElement('canvas');
                
        canvas.width = image.width;
        canvas.height = image.height;
        let ctx = canvas.getContext("2d");
        ctx.drawImage(image, 0,0);
        return new Layer(ctx.getImageData(0,0,canvas.width, canvas.height), json.visible);
    }
}

export class CanvasState {
    private _layers: Layer[] = [];
    private _activeLayerId: number = 0;
    private _dimension: Vector2 = new Vector2(100,100);
    

    private tab: CanvasProjectTab;
    activeLayerChange: Signal = new Signal();
    dimensionChange: Signal = new Signal();
    layersChange: Signal = new Signal();

    constructor(tab: CanvasProjectTab, data: ImageData) {
        this.tab = tab;
        this._dimension = new Vector2(data.width, data.height);
        this._layers = [new Layer(data)];
    }
    static from(state: CanvasState) {
        let newState = new CanvasState(state.tab, new ImageData(1,1));
        newState._activeLayerId = state._activeLayerId;
        newState.dimension = state.dimension;
        newState._layers = [...state._layers.map((layer) => new Layer(layer.getImageData()))];
        return newState;
    }
    flatten(): Layer {
        return this._layers.reduce((prev, curr) => {
            prev.ctx.drawImage(curr.canvas,0,0);
            return prev;
        })
    }
    set dimension(dimension: Vector2) {
        this._dimension = dimension;
        this.dimensionChange.signal();
    }
    get dimension() {
        return this._dimension;
    }
    get activeLayer() {
        return this._layers[this._activeLayerId];
    }
    setActiveLayer(id: number) {
        this._activeLayerId = id;
        this.activeLayerChange.signal();
    }
    get layers() {
        return this._layers;
    }
    addLayer(layer: Layer) {
        this._layers = [...this.layers, layer]
        this.setActiveLayer(this.layers.length-1);
        this.layersChange.signal();
        this.activeLayerChange.signal();
        
    }
    async asJSON() {
        let layers = [];
        for(let layer of this.layers) {
            const layerJSON = await layer.asJSON();
            layers.push(layerJSON);
        }
        return {
            width: this.dimension.x,
            height: this.dimension.y,
            activeLayer: this._activeLayerId,
            layers: layers
        }
    }
    static async fromJSON(tab: CanvasProjectTab, json: {width: number, height: number, activeLayer: number, layers: any[]}) {
        let layers = [];
        for(let layerJSON of json.layers) {
            const layer = await Layer.fromJSON(layerJSON);
            layers.push(layer);
        }

        let newState = new CanvasState(tab, new ImageData(json.width,json.height));
        newState._activeLayerId = json.activeLayer;
        newState.dimension = new Vector2(json.width, json.height);
        newState._layers = layers;
        return newState;
    }

}

