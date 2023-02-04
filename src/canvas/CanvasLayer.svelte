<script lang="ts">
    import type { CanvasState } from "src/haumea/canvas";
    import type { PercentagePos } from "src/haumea/math";
    import { canvas, transition } from "haumea/preview";

    export let pos: PercentagePos;
    export let zoom: number;
    export let currentState: CanvasState;
    export let index: number;

    let activeLayerId: number
    $: currentState.activeLayer.$.subscribe(n => activeLayerId = n);
</script>
{#if activeLayerId == index}
<canvas
    bind:this={$canvas}
    class:has-transition={$transition}
    width="{currentState.dimension.value.x}" height="{currentState.dimension.value.y}"
    style="top: {pos.y}%; left: {pos.x}%; scale: {zoom}"
></canvas>
{:else}
<canvas 
    class:has-transition={$transition}
    width="{currentState.dimension.value.x}" height="{currentState.dimension.value.y}"
    style="top: {pos.y}%; left: {pos.x}%; scale: {zoom}"
></canvas>
{/if}
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