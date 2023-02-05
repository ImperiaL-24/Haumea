<script lang="ts">
    import { currentTab } from "src/haumea/tab";
    import type { Reactive } from "src/util";
    import { onMount } from "svelte";
    import { canvas } from "src/haumea/preview";
    import { canvasChange } from "src/haumea/canvas";


    export let index: number;
    export let data: ImageData;

    let activeLayer: Reactive<number>
    $: activeLayer = $currentTab.canvasData?.get().activeLayer

    let activeLayerStore: number
    $: $currentTab.canvasData?.get().activeLayer.$.subscribe(n => activeLayerStore = n);

    let canvasPreview: HTMLCanvasElement

    canvasChange.subscribe(() => {
        if(!canvasPreview) return;
        const layerCanvas = $canvas[index];
        let ctx = layerCanvas.getContext("2d");
        let data = ctx.getImageData(0, 0, layerCanvas.clientWidth, layerCanvas.clientHeight);

        canvasPreview.height = layerCanvas.height;
        canvasPreview.width = layerCanvas.width;

        ctx = canvasPreview.getContext("2d");
        ctx.putImageData(data, 0, 0);
    });

    
    
</script>
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class:active={activeLayerStore == index} on:click={() => activeLayer.value = index} class="main">
    <canvas bind:this={canvasPreview}></canvas>
    <div class="content">
        <p>Layer {index}</p>
    </div>
</div>

<style lang="scss">
    canvas {
        width: 3rem;
        height: 3rem;
        border-radius: 5px;
        margin: 10px;
        box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
    }
    .main {
        width: calc(100% - 10px);
        height: 70px;
        background-color: rgba(39, 44, 48, 1);
        border-radius: 5px;
        display: flex;
        align-items: center;
        transition: all 0.2s;
        border-radius: 5px;
        margin: 5px 0px;
        font-size: 0.8rem;
        filter: none;
        &:hover {
            filter: drop-shadow(0px 0px 5px hsla(353, 75%, 60%, 0.25));
            background-color: rgb(52, 60, 66);
        }
    }

    .content {
        width: calc(100% - 3em - 20px);
        display: flex;
        justify-content: center;
    }

    .active {
        background-color: rgba(73, 80, 87, 1)!important;
        color: rgba(255, 255, 255, 0.8)!important;
    }
</style>