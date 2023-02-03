<script lang="ts">
    import { onMount } from "svelte";
    import { getClickLocation } from "../util";
    import { currentTool } from "../engine/tool/ToolManager";
    import { canvas, canvasBase, ctx, getCanvasPosition, setCanvasData, setCanvasPosition, transition } from "../haumea/preview";
    import { innerRect } from "../store";
    import Cursor from "./Cursor.svelte";
    import { currentTab, currentTabId, ProjectTabType, tabs } from "haumea/tab";
    import type { PercentagePos } from "src/haumea/math";
    import { get } from "svelte/store";
    let zoom: number;
    $: $currentTab.canvasData?.zoom.$.subscribe(n => zoom = n);
    $: if($canvas) $canvas.style.scale = `${zoom}`;

    let position: PercentagePos;
    $: $currentTab.canvasData?.position.$.subscribe(n => position = n);
    
    onMount(() => {
        $ctx = $canvas.getContext("2d");
        $ctx.imageSmoothingEnabled = false;
        $ctx.fillStyle = "#FFFFFF"
        $ctx.fillRect(0,0,256, 256)
        get(currentTab).canvasData.saveState();
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
        const unsubscribe = currentTab.subscribe((n) => {
            if(n.type == ProjectTabType.IMAGE) setCanvasData(n.canvasData.get());
        })
        return (() => unsubscribe());
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
    <canvas 
    bind:this={$canvas}
    class:has-transition={$transition}
    width="255" height="255"
    style="top: {position.y}%; left: {position.x}%;"
    ></canvas>
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
        canvas {
            position: absolute;
            box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
            transition: 0.2s width, 0.2s height;   
            image-rendering: pixelated;
            translate: -50% -50%;
            z-index: 1;
        }

    }
    .has-transition {
        transition: 0.2s all;
    }
</style>