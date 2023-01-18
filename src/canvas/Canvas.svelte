<script lang="ts">
    import { currentColor } from "../engine/ColorManager";
    import { onMount } from "svelte";
    import { getClickLocation } from "../util";
    import { currentTool } from "../engine/tool/ToolManager";

    export let zoom: number = 1;

    let canvas;
    let ctx: CanvasRenderingContext2D;
    let pixel;
    let d;

    let isClicked: boolean;
    onMount(() => {
        ctx = canvas.getContext("2d");
        ctx.imageSmoothingEnabled       = false;

        pixel = ctx.createImageData(1,1);
        d = pixel.data;
    })
    let handleClick = (e) => {
        $currentTool.onclick(e);
        // const color = $currentColor.asRGB();
        // const location = getClickLocation(canvas, e);
        // d[0] = color[0];
        // d[1] = color[1];
        // d[2] = color[2];
        // d[3] = 255;    
        // ctx.putImageData(pixel, location.x/zoom, location.y/zoom)
        // console.log(e);
    }

    $: {
        if(canvas) {
            canvas.style.scale = `${zoom} ${zoom}`
        }
    }

    let onWheel = (e) => {
        zoom = e.deltaY < 0 ? Math.min(1000, zoom * -e.deltaY/100) : Math.max(0.01, zoom / (e.deltaY/100))
    }
</script>
<div>
    <canvas 
    bind:this={canvas} 
    width="255" height="255" 
    on:mousedown={() => isClicked = true}
    on:wheel|passive={(e) => onWheel(e)}
    ></canvas>
</div>


<svelte:window on:mouseup={() => {isClicked=false}} on:mousemove={(e) => {if(isClicked) handleClick(e)}}/>


<style lang="scss">
    div {
        height: calc(100vh - 28px);
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    canvas {
        position: absolute;
        box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
        transition: 0.2s all;   
        image-rendering: pixelated;
    }
</style>