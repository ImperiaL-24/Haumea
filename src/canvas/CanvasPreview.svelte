<script lang="ts">
    import {App, CanvasProjectTab} from "src/haumea/tab";
    import type { Layer } from "src/haumea/canvas";
    import { Vector2 } from "src/haumea/math";

    export let layer: Layer;
    export let from: Vector2 = new Vector2();
    export let to: Vector2 = null;
    let canvasPreview: HTMLCanvasElement;

    $$: App.activeTabChange => let activeCanvas: CanvasProjectTab = App.activeCanvas;

    let updateCanvas = () => {
        if(!canvasPreview) return;

        let pos = layer.minPoint.clone();
        let dimension = activeCanvas.activeState.dimension.clone();

        let data: ImageData;

        data = layer.getImageData(pos.negate(), dimension.add(pos.negate()));
        console.log(to, from)
        canvasPreview.width = data.width
        canvasPreview.height = data.height;
        const ctx = canvasPreview.getContext("2d");
        ctx.putImageData(data,0,0);
    }
        
    $$: $: layer.layerChange => updateCanvas();
    $$: $: layer.dimensionChange => updateCanvas();
</script>

<canvas bind:this={canvasPreview}></canvas>

<style lang="scss">
    canvas {
        width: 100%;
        height: 100%;
        z-index: -1;
    }
</style>