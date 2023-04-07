<script lang="ts">
    import { App } from "src/haumea/tab";
    import type { CanvasState, Layer } from "src/haumea/canvas";
    import CanvasPreview from "src/canvas/CanvasPreview.svelte";


    export let index: number;
    export let layer: Layer;
    export let currentState: CanvasState;

    $$: $: currentState?.activeLayerChange => let activeLayer = currentState?.activeLayer;

    $$: $: layer.visibilityChange => let visible = layer.visible;
    $$: $: layer.visibilityChange => console.log(visible);
</script>
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class:active={activeLayer == layer} on:click={() => App.activeCanvas.activeState.setActiveLayer(index)} class="main">
    <div class="visibility">
        {#if visible}
            <img src="icons/visible.svg" alt="visibility" on:click={() => {App.activeCanvas.addState().layers[index].visible = false;}}>
        {:else}
            <img src="icons/invisible.svg" alt="visibility" on:click={() => {App.activeCanvas.addState().layers[index].visible = true;}}>
        {/if}
    </div>
    <div class="canvas">
        <CanvasPreview bind:layer={layer}></CanvasPreview>
    </div>
    
    <div class="content">
        <p>Layer {index}</p>
    </div>
    <div class="move">
        <div on:click={() => {if(App.activeCanvas.activeState.layers.length != index+1) App.activeCanvas.addState().swapLayers(index,index+1)}}>▲</div>
        <div on:click={() => {if(index!=0) App.activeCanvas.addState().swapLayers(index,index-1)}}>▼</div>
    </div>
</div>  

<style lang="scss">
    img {
        width: 1.25em;
        filter: invert(100%);
    }
    .move {
        width: 1rem;
        margin: 10px;
        div {
            text-align: center;
        }
    }
    .visibility {
        width: 2.4rem;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .canvas {
        width: 3rem;
        height: 3rem;
        border-radius: 5px;
        margin: 10px;
        margin-left: 0;
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
        width: calc(100% - 6.4rem - 30px);
        display: flex;
        justify-content: center;
    }

    .active {
        background-color: rgba(73, 80, 87, 1)!important;
        color: rgba(255, 255, 255, 0.8)!important;
    }
</style>