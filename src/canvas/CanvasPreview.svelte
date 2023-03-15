<script lang="ts">
    import type { CanvasState, Layer } from "src/haumea/canvas";
    import { App, type CanvasProjectTab } from "src/haumea/tab";
    import { onMount } from "svelte";

    export let layer: Layer;
    let width: number;
    let height: number;
    let canvasPreview: HTMLCanvasElement;

    let activeCanvas: CanvasProjectTab;
    $: App.activeTabChange.subscribe(() => activeCanvas = App.activeCanvas);
    console.log("PREVIEW BUILD");
    let updateCanvas = () => {
        if(!canvasPreview) return;
        const data: ImageData = layer.getImageData();
        width = data.width;
        height = data.height;
        const ctx = canvasPreview.getContext("2d");
        ctx.putImageData(data,0,0);
    }

    layer.layerChange.subscribe(() => {
        console.warn("LAYER CHANGE")
        updateCanvas()
    });
    onMount(() => {
        console.log(layer);
    })

    $: activeCanvas?.data.activeStateChange.subscribe(() => {
        updateCanvas();
    });
</script>

<canvas bind:this={canvasPreview} width="{width}" height="{height}"></canvas>

<style lang="scss">
    canvas {
        width: 100%;
        height: 100%;
    }

</style>