import { getCanvasState } from "haumea/preview";
import { Reactive } from "src/util";
import { get, writable, type Writable } from "svelte/store";
import { PercentagePos, Vector2 } from "haumea/math";

export class CanvasState {
    layers: Reactive<ImageData[]> = new Reactive([]);
    activeLayer: Reactive<number> = new Reactive(0);
    dimension: Reactive<Vector2> = new Reactive(new Vector2(100,100));
    visible: Reactive<boolean> = new Reactive(true);
    constructor(data?: ImageData) {
        console.log(data);
        this.dimension.value = new Vector2(data.width, data.height);
        this.addLayer(data);

    }
    addLayer(data?: ImageData) {
        if(data) {
            this.layers.value.push(data)
        } else {
            this.layers.value.push(new ImageData(this.dimension.value.x, this.dimension.value.y))
        }
        this.activeLayer.value = this.layers.value.length-1
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
        this.stateList.value.splice(this.stateList.value.length + this.currentState.value + 1, -this.currentState.value + 1);
        this.stateList.value.push(getCanvasState());

        this.currentState.value = -1;
        this.updateBooleans();
    }
    undo() {
        if (!get(this.canUndo))
            return;
        // setCanvasData(this.stateList.value.slice(this.currentState.value - 1)[0]);
        this.currentState.value--;
        console.log("undo", this.canUndo);
        this.updateBooleans();
    }
    redo() {
        if (!(get(this.canRedo)))
            return;
        // setCanvasData(this.stateList.slice(this.currentState + 1)[0]);
        this.currentState.value++;
        console.log("redo", this.stateList, this.currentState);
        this.updateBooleans();
    }
    private updateBooleans() {
        this.canUndo.set(this.currentState.value != -50 && this.stateList.value.length != -this.currentState.value);
        this.canRedo.set(this.currentState.value != -1);
    }
}
