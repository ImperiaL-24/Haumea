<script lang="ts">
    import type { Layer } from "src/haumea/canvas";
    import type { Vector2 } from "src/haumea/math";
    import { transition } from "src/haumea/preview";
    import { App, CanvasProjectTab } from "src/haumea/tab";
    import CanvasPreview from "./CanvasPreview.svelte";
export let layer: Layer;

let pos: Vector2;
let dimension: Vector2;
$$: App.activeTabChange => let activeCanvas: CanvasProjectTab = App.activeCanvas;
$$: $: activeCanvas?.zoomChange => let zoom = activeCanvas?.zoom;

let updateCanvas = () => {
    pos = layer.minPoint.clone();
    dimension = activeCanvas.activeState.dimension.clone();
    console.log("UPDATED CANVAS POS", pos, dimension)
}
    
$$: $: layer.dimensionChange => updateCanvas();
</script>


<div class="canvas" style="left: {0}px; top: {0}px; width: {dimension.x*zoom}px; height: {dimension.y*zoom}px; opacity: {layer.visible ? "1" : "0"}; transition: {$transition ? "0.2s all" : "none"}"> 
    <CanvasPreview bind:layer={layer} from={pos.negate()} to={dimension.add(pos.negate())}></CanvasPreview>
</div>

<style lang="scss">
.canvas {
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    position: absolute;
}
</style>