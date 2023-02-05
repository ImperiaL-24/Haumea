<script lang="ts">
    import { currentTab } from "src/haumea/tab";
    import type { Reactive } from "src/util";
    import { onMount } from "svelte";
    import { canvas } from "src/haumea/preview";


    export let index: number;
    export let data: ImageData;

    let activeLayer: Reactive<number>
    $: activeLayer = $currentTab.canvasData?.get().activeLayer

    let activeLayerStore: number
    $: $currentTab.canvasData?.get().activeLayer.$.subscribe(n => activeLayerStore = n);

    $: $currentTab.canvasData?.stateList.$.subscribe(n => {
        console.log("DRAWING STATELIST")
        if(!canvasPreview) return;
        const layerCanvas = $canvas[index];
        let ctx = layerCanvas.getContext("2d");
        let data = ctx.getImageData(0, 0, layerCanvas.clientWidth, layerCanvas.clientHeight);

        ctx = canvasPreview.getContext("2d");
        ctx.putImageData(data, 0, 0);
        console.log("DRAWING PREVIEW", data)
    });

    $: canvas.subscribe(n => {
        if(!canvasPreview) return;
        const layerCanvas = $canvas[index];
        let ctx = layerCanvas.getContext("2d");
        let data = ctx.getImageData(0, 0, layerCanvas.clientWidth, layerCanvas.clientHeight);

        ctx = canvasPreview.getContext("2d");
        ctx.putImageData(data, 0, 0);
        console.log("DRAWING PREVIEW", data)
    });

    let canvasPreview: HTMLCanvasElement
    
    onMount(() => {
        
    })
</script>
<div class:active={activeLayerStore == index}>
    <canvas bind:this={canvasPreview}></canvas>
    <p>{index} - hi</p>
    <button on:click={() => activeLayer.value = index} >SET ACTIVE!</button>
</div>

<style lang="scss">
    // canvas {
    //     width: 2em;
    //     height: 2em;
    // }
    div {
        width: 100%;
        background-color: rgba(39, 44, 48, 0.8);
        border-radius: 5px;
        backdrop-filter: blur(12px);
        display: flex;
    }

    .active {
        background-color: rgba(73, 80, 87, 0.8);
    }
</style>