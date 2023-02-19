<script lang="ts">
    import { onMount } from "svelte";
    import { getClickLocation } from "../util";
    import { currentTool } from "../engine/tool/ToolManager";
    import { canvas, canvasBase, getCanvasPosition, setCanvasPosition, transition } from "../haumea/preview";
    import { innerRect } from "../store";
    import Cursor from "./Cursor.svelte";
    import { currentTab, currentTabId, tabs } from "haumea/tab";
    import type { PercentagePos } from "src/haumea/math";
    import { Layer, stateChange, type CanvasState } from "src/haumea/canvas";
    import CanvasLayer from "./CanvasLayer.svelte";
    let zoom: number;
    $: $currentTab.canvasData?.zoom.$.subscribe(n => zoom = n);

    let position: PercentagePos;
    $: $currentTab.canvasData?.position.$.subscribe(n => position = n);

    let currentState: CanvasState;

    let stateChangeSubscriber = () => {};

    currentTab.subscribe(() => {
        stateChangeSubscriber();
        stateChangeSubscriber = stateChange.subscribe(() => {
            currentState = $currentTab.canvasData?.get();
        })
    })
    let layers: Layer[]
    $: currentState?.layers.$.subscribe(n => layers = n);

    let activeLayerId: number
    $: currentState?.activeLayer.$.subscribe(n => activeLayerId = n);
    
    onMount(() => {
        // $ctx = $canvas.getContext("2d");
        // $ctx.imageSmoothingEnabled = false;
        // $ctx.fillStyle = "#FFFFFF"
        // $ctx.fillRect(0,0,256, 256)
        // get(currentTab).canvasData.saveState();
        // console.log(currentState);
        // // $currentTab.canvasData.get().addLayer(new Layer(new ImageData(100,100)))
        // console.log($currentTab.canvasData.get());
    })

    currentTab.subscribe(_n => {
        $transition = false;
    })

    let onWheel = (e) => {
        
        $transition = true;
        const mouseLocation = getClickLocation($canvasBase);
        const oldZoom = $currentTab.canvasData.zoom.value;
        const newZoom = e.deltaY < 0 ? Math.min(1000, oldZoom *1.25) : Math.max(0.01, oldZoom /1.25);
        $tabs.get($currentTabId).canvasData.zoom.value = newZoom;
 
        setCanvasPosition(getCanvasPosition().add(mouseLocation.negate()).product(newZoom/oldZoom).add(mouseLocation).asPixelPos());

    }
    let isMouseOver: boolean = false;
    onMount(() => {
        // const unsubscribe = currentTab.subscribe((n) => {
        //     if(n.type == ProjectTabType.IMAGE) setCanvasState(n.canvasData.get());
        // })
        // return (() => unsubscribe());
    })
</script>

<div 
on:mouseenter={() => isMouseOver=true} 
on:mouseleave={() => isMouseOver=false}
on:mousemove={(e) => $currentTool.onmousemove(e)}
on:mousedown={(e) => $currentTool.onmousedown(e)}
on:mouseup={(e) => $currentTool.onmouseup(e)}
bind:this={$canvasBase} style="width:calc(100% - {$innerRect.width}px); margin-left:{$innerRect.x}px; height:calc(100vh - {$innerRect.height}px)" 
on:wheel|passive={(e) => onWheel(e)}>

    {#each layers as layer, i}
        <CanvasLayer bind:pos={position} bind:zoom={zoom} bind:currentState={currentState} layer={layer} index={i}></CanvasLayer>
    {/each}

<div class="shadow"
class:has-transition={$transition}
style="top: {position.y}%; left: {position.x}%; scale: {zoom}; width: {currentState?.dimension.value.x}px; height: {currentState?.dimension.value.y}px">
</div>
</div>
{#if isMouseOver}
    <Cursor></Cursor>
{/if}


<svelte:window on:mousemove={(e) => {}} />


<style lang="scss">
    div {
        position: relative;
        height: 100vh;
        width: 100%;
        z-index: 0;
        cursor: none;
        canvas, .shadow {
            position: absolute;
            transition: 0.2s width, 0.2s height;   
            image-rendering: pixelated;
            translate: -50% -50%;
            z-index: 1;
        }

        .shadow {
            box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
        }

    }
    .has-transition {
        transition: 0.2s all!important;
    }
</style>