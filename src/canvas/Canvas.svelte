<script lang="ts">
    import { currentColor } from "../engine/ColorManager";
    import { onMount } from "svelte";
    import { getClickLocation, getMappedClickLocation } from "../util";
    import { currentTool } from "../engine/tool/ToolManager";
    import { canvas, canvasBase, ctx, zoom } from "../engine/canvas/Canvas";

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
        const mouseLocation = getMappedClickLocation($canvasBase, e);
        const imagepos = [parseFloat($canvas.style.left.slice(0,-1)),parseFloat($canvas.style.top.slice(0,-1))]
        console.log(mouseLocation.x*100-imagepos[0], mouseLocation.y*100 - imagepos[1]);
        const oldZoom = $zoom;
        $zoom = e.deltaY < 0 ? Math.min(1000, $zoom * -e.deltaY/100) : Math.max(0.01, $zoom / (e.deltaY/100))
        $canvas.style.left = `${imagepos[0]+(mouseLocation.x*100-imagepos[0])*(oldZoom-$zoom)}%`;
        $canvas.style.top =  `${imagepos[1]+(mouseLocation.y*100-imagepos[1])*(oldZoom-$zoom)}%`;
    }
</script>
<div bind:this={$canvasBase}>
    <canvas 
    bind:this={$canvas} 
    width="255" height="255" 
    on:mousedown={() => isClicked = true}
    
    style="top: 50%; left:50%;"
    ></canvas>
</div>


<svelte:window on:mouseup={() => {isClicked=false}} on:mousemove={(e) => {if(isClicked) handleClick(e)}} on:wheel|passive={(e) => onWheel(e)}/>


<style lang="scss">
    div {
        position: relative;
        height: calc(100vh - 28px);
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

</style>