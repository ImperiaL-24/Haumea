import { blobToBase64, Signal } from "src/util";
import { Vector2 } from "haumea/math";
import type { CanvasProjectTab } from "./tab";
import type { Brush } from "./tool/tool";
import { transition } from "./preview";

export class Layer {
    canvas: OffscreenCanvas;
    ctx: OffscreenCanvasRenderingContext2D;
    private _visible: boolean = true;

    minPoint: Vector2 = new Vector2();
    maxPoint: Vector2 = new Vector2(1,1);

    visibilityChange: Signal = new Signal();
    layerChange: Signal = new Signal();
    dimensionChange: Signal = new Signal();

    constructor(data: ImageData, visible?: boolean) {
        this.canvas = new OffscreenCanvas(data.width, data.height);
        this.maxPoint = new Vector2(data.width-1, data.height-1);
        this.ctx = this.canvas.getContext("2d", {willReadFrequently: true}) as OffscreenCanvasRenderingContext2D;
        this.ctx.putImageData(data, 0, 0);
        this._visible = visible ?? true;
    }
    clone() {
        let newLayer = new Layer(this.ctx.getImageData(0,0, this.canvas.width, this.canvas.height), this._visible);
        newLayer.minPoint = new Vector2(this.minPoint.x, this.minPoint.y);
        newLayer.maxPoint = new Vector2(this.maxPoint.x, this.maxPoint.y);
        return newLayer;
    }
    set visible(visible: boolean) {
        this._visible = visible;
        this.visibilityChange.signal();
    }
    get visible() {
        return this._visible;
    }
    get dimensions() {
        return this.maxPoint.add(this.minPoint.negate()).addScalar(1);
    }
    resizeToFit(position: Vector2) {
        let altered: boolean = false;
        const oldMinPoint = new Vector2(this.minPoint.x, this.minPoint.y);
        if(position.x < this.minPoint.x) {
            this.minPoint.x = position.x;
            altered = true;
        }
        if(position.y < this.minPoint.y) {
            this.minPoint.y = position.y;
            altered = true;
        }
        if(position.x > this.maxPoint.x) {
            this.maxPoint.x = position.x;
            altered = true;
        }
        if(position.y > this.maxPoint.y) {
            this.maxPoint.y = position.y;
            altered = true;
        }
        if(altered == false) return;
        transition.set(false);
        const data = this.ctx.getImageData(0,0, this.canvas.width, this.canvas.height);
        this.canvas = new OffscreenCanvas(this.dimensions.x, this.dimensions.y);
        this.ctx = this.canvas.getContext("2d", {willReadFrequently: true}) as OffscreenCanvasRenderingContext2D;
        this.ctx.putImageData(data, oldMinPoint.x-this.minPoint.x, oldMinPoint.y-this.minPoint.y);
        this.dimensionChange.signal();
    }
    moveBy(delta: Vector2) {
        this.minPoint = this.minPoint.add(delta);
        this.maxPoint = this.maxPoint.add(delta);
        this.dimensionChange.signal();
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
        const pos = position.addScalar(-(brush.size-1)/2).floor();
        //TODO: RESIZE BLOCK NOT APPLICATON POINT
        this.resizeToFit(pos);
        this.ctx.putImageData(pixel, pos.x-this.minPoint.x, pos.y-this.minPoint.y);
        if(!silent) this.layerChange.signal();
    }
    line(from: Vector2, to: Vector2, brush: Brush) {
        const pixelDistance = to.floor().add(from.floor().negate()).abs().maxCoord();
        this.resizeToFit(to.floor());
        if(pixelDistance==0) return;
        for(let i=1;i<=pixelDistance;i++) {
            this.drawTo(from.lerp(to, i/pixelDistance), brush, true);
        }
        this.layerChange.signal();
    }
    getImageData(from?: Vector2, to?: Vector2) {
        const start = from ?? new Vector2();
        const end = to ?? new Vector2(this.canvas.width, this.canvas.height);
        return this.ctx.getImageData(start.x,start.y, end.x, end.y);
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
        this._layers = [new Layer(data, true)];
    }
    static from(state: CanvasState) {
        let newState = new CanvasState(state.tab, new ImageData(1,1));
        newState._activeLayerId = state._activeLayerId;
        newState.dimension = state.dimension;
        newState._layers = state._layers.flatMap((layer) => layer.clone());
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

