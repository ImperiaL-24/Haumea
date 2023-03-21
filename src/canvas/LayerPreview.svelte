<script lang="ts">
    import type { Layer } from "src/haumea/canvas";
    import { App, CanvasProjectTab } from "src/haumea/tab";
    import CanvasPreview from "./CanvasPreview.svelte";
export let layer: Layer;

let x,y,w,h: number;

$$: App.activeTabChange => let activeCanvas: CanvasProjectTab = App.activeCanvas;
$$: $: activeCanvas?.zoomChange => let zoom = activeCanvas?.zoom;

let updateCanvas = () => {
    x = layer.minPoint.x;
    y = layer.minPoint.y;
    w = layer.dimensions.x;
    h = layer.dimensions.y;
    console.log("UPDATED CANVAS POS")
}
    
$$: $: layer.dimensionChange => updateCanvas();
</script>


<div class="canvas" style="left: {x*zoom}px; top: {y*zoom   }px; width: {w*zoom}px; height: {h*zoom}px; opacity: {layer.visible ? "1" : "0"}"> 
    <CanvasPreview bind:layer={layer}></CanvasPreview>
</div>

<style lang="scss">
.canvas {
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    position: absolute;
    transition: 0.2s all;
}
</style>