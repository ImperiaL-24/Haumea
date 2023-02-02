<script lang="ts">
    import { onMount } from "svelte";
    import { getClickLocation } from "../util";
    import { currentTool } from "../engine/tool/ToolManager";
    import { canvas, canvasBase, ctx, getCanvasPosition, setCanvasPosition, transition, zoom } from "../engine/canvas/Canvas";
    import { innerRect } from "../store";
    import Cursor from "./Cursor.svelte";
    import { saveCanvas } from "../engine/canvas/UndoManager";
    onMount(() => {
        $ctx = $canvas.getContext("2d");
        $ctx.imageSmoothingEnabled = false;
        $ctx.fillStyle = "#FFFFFF"
        $ctx.fillRect(0,0,256, 256)
        saveCanvas();
    })

    $: {
        if($canvas) {
            $canvas.style.scale = `${$zoom} ${$zoom}`
        }
    }

    let onWheel = (e) => {
        $transition = true;
        const mouseLocation = getClickLocation($canvasBase);
        const oldZoom = $zoom;
        $zoom = e.deltaY < 0 ? Math.min(1000, $zoom *1.25) : Math.max(0.01, $zoom /1.25);
 
        setCanvasPosition(getCanvasPosition().add(mouseLocation.negate()).product($zoom/oldZoom).add(mouseLocation).asPixelPos());
        
        $canvas.style.scale = `${$zoom} ${$zoom}`

    }
    let isMouseOver: boolean = false;
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
    style="top: 50%; left:50%;"
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
            transition: 0.2s scale, 0.2s width, 0.2s height;   
            image-rendering: pixelated;
            translate: -50% -50%;
            z-index: 1;
        }

    }
    .has-transition {
        transition: 0.2s all;
    }
</style>