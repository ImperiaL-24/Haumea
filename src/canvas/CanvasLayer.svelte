<script lang="ts">
    import type { CanvasState } from "src/haumea/canvas";
    import type { PercentagePos } from "src/haumea/math";
    import { canvas, ctx, transition } from "haumea/preview";
    import { onMount } from "svelte";
    import { currentTab } from "src/haumea/tab";

    export let pos: PercentagePos;
    export let zoom: number;
    export let currentState: CanvasState;
    export let index: number;

    currentState.activeLayer.$.subscribe(n => {
        console.log("MOUNT LAYER!")
        const data: ImageData = currentState.layers.value[index];
        
        if($canvas[index]) {
            const ctx = $canvas[index].getContext("2d");
            ctx.putImageData(data, 0, 0);
        }

    });
    $: {
        currentState;
        const data: ImageData = currentState.layers.value[index];
        console.log(currentState.layers.value, $currentTab.canvasData?.stateList)
        if($canvas[index]) {
            console.warn("CURRENT STATE CHANGE", currentState)
            const ctx = $canvas[index].getContext("2d");
            ctx.putImageData(data, 0, 0);
        }
    }
    //TODO: CANVAS AS BITMAP RENDERER;
</script>

<canvas
    bind:this={$canvas[index]}
    class:has-transition={$transition}
    width="{currentState.dimension.value.x}" height="{currentState.dimension.value.y}"
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