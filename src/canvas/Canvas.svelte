<script lang="ts">
    import { onMount } from "svelte";
    import { getClickLocation } from "../util";
    import { currentTool } from "../engine/tool/ToolManager";
    import { canvas, canvasBase, ctx, getCanvasPosition, setCanvasData, setCanvasPosition, transition, zoom } from "../haumea/preview";
    import { innerRect } from "../store";
    import Cursor from "./Cursor.svelte";
    import { saveCanvas } from "../engine/canvas/UndoManager";
    import { currentTab, currentTabId, ProjectTabType, tabs } from "haumea/tab";

    let position;
    $: console.log(position);
    $: position = $currentTab.canvasData?.position;
    onMount(() => {
        $ctx = $canvas.getContext("2d");
        $ctx.imageSmoothingEnabled = false;
        $ctx.fillStyle = "#FFFFFF"
        $ctx.fillRect(0,0,256, 256)
        saveCanvas();
    })

    currentTab.subscribe(n => {
        if($canvas) {
            $transition = false;
            canvas.update(m => {
                m.style.scale = `${n.canvasData.zoom}`
                m.style.top = `${n.canvasData.position.y}%`;
                m.style.left = `${n.canvasData.position.x}%`;
                return m;
            })
        }
        
    })

    let onWheel = (e) => {
        
        $transition = true;
        const mouseLocation = getClickLocation($canvasBase);
        const oldZoom = $tabs.get($currentTabId).canvasData.zoom;
        const newZoom = e.deltaY < 0 ? Math.min(1000, oldZoom *1.25) : Math.max(0.01, oldZoom /1.25);
        $tabs.get($currentTabId).canvasData.zoom = newZoom;
 
        setCanvasPosition(getCanvasPosition().add(mouseLocation.negate()).product(newZoom/oldZoom).add(mouseLocation).asPixelPos());
        
        $canvas.style.scale = `${newZoom}`

    }
    let isMouseOver: boolean = false;
    onMount(() => {
        currentTab.subscribe((n) => {
            if(n.type == ProjectTabType.IMAGE) setCanvasData(n.canvasData.get());
        })
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