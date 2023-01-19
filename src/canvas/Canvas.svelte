<script lang="ts">
    import { onMount } from "svelte";
    import { getMappedClickLocation } from "../util";
    import { currentTool } from "../engine/tool/ToolManager";
    import { canvas, canvasBase, ctx, setCanvasPosition, transition, zoom } from "../engine/canvas/Canvas";

    let isClicked: boolean;

    onMount(() => {
        $ctx = $canvas.getContext("2d");
        $ctx.imageSmoothingEnabled = false;
        $ctx.fillStyle = "#FFFFFF"
        $ctx.fillRect(0,0,256, 256)
    })
    let handleClick = (e) => {
        $currentTool.onclick(e);
    }

    $: {
        if($canvas) {
            $canvas.style.scale = `${$zoom} ${$zoom}`
        }
    }

    let onWheel = (e) => {
        $transition = true;
        const mouseLocation = getMappedClickLocation($canvasBase, e);
        let imagepos = [parseFloat($canvas.style.left.slice(0,-1)),parseFloat($canvas.style.top.slice(0,-1))]
        const oldZoom = $zoom;

        $zoom = e.deltaY < 0 ? Math.min(1000, $zoom *1.25) : Math.max(0.01, $zoom /1.25);

        setCanvasPosition($zoom/oldZoom * (imagepos[0] - mouseLocation.x*100) + mouseLocation.x*100,$zoom/oldZoom * (imagepos[1] - mouseLocation.y*100) + mouseLocation.y*100);
        
        $canvas.style.scale = `${$zoom} ${$zoom}`

    }
</script>

<div bind:this={$canvasBase} on:wheel|passive={(e) => onWheel(e)}>
    <canvas 
    bind:this={$canvas}
    class:has-transition={$transition}
    width="255" height="255" 
    on:mousedown={() => isClicked = true}
    
    style="top: 50%; left:50%;"
    ></canvas>
</div>


<svelte:window on:mouseup={() => {isClicked=false}} on:mousemove={(e) => {if(isClicked) handleClick(e)}} />


<style lang="scss">
    div {
        position: relative;
        height: 100vh;
        width: 100%;
        z-index: 0;

        canvas {
            position: absolute;
            box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
            transition: 0.2s scale;   
            image-rendering: pixelated;
            translate: -50% -50%;
            z-index: 1;
        }

    }
    .has-transition {
        transition: 0.2s all;
    }
</style>