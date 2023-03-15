<script lang="ts">
    import type { Layer, CanvasState } from "src/haumea/canvas";
    import type { PercentagePos } from "src/haumea/math";
    import { canvas, transition } from "haumea/preview";
    import { App, type CanvasProjectTab } from "src/haumea/tab";

    export let pos: PercentagePos;
    export let zoom: number;
    export let layer: Layer;
    export let currentState: CanvasState;
    export let index: number;

    let activeCanvas: CanvasProjectTab;
    $: App.activeTabChange.subscribe(() => activeCanvas = App.activeCanvas);

    let updateCanvas = () => {
        if(!$canvas[index]) return;
        const data: ImageData = layer.getImageData();
        const ctx = $canvas[index].getContext("2d");
        ctx.putImageData(data, 0,0);
    }

    $: layer.layerChange.subscribe(() => {
        updateCanvas()
    });

    $: activeCanvas?.data.activeStateChange.subscribe(() => {
        updateCanvas();
    });
</script>

<canvas
    bind:this={$canvas[index]}
    class:has-transition={$transition}
    width="{currentState?.dimension.value.x}" height="{currentState?.dimension.value.y}"
    style="top: {pos.y}%; left: {pos.x}%; scale: {zoom}"
></canvas>

<style lang="scss">
    canvas {
        position: absolute;
        transition: 0.2s width, 0.2s height;   
        image-rendering: pixelated;
        translate: -50% -50%;
        z-index: 1;
    }

    .has-transition {
        transition: 0.2s all!important;
    }
</style>