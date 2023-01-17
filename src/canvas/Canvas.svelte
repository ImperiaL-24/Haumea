<script lang="ts">
    import { currentColor } from "../engine/ColorManager";
    import { onMount } from "svelte";
    import { getClickLocation } from "../util";
    let canvas;
    let ctx: CanvasRenderingContext2D;
    let pixel;
    let d;

    let isClicked: boolean;
    onMount(() => {
        ctx = canvas.getContext("2d");
        pixel = ctx.createImageData(1,1);
        d  = pixel.data;
    })
    let handleClick = (e) => {
        
        const color = $currentColor.asRGB();
        const location = getClickLocation(canvas, e);
        console.log(location);
        d[0] = color[0];
        d[1] = color[1];
        d[2] = color[2];
        d[3] = 255;    
        ctx.putImageData(pixel, location.x, location.y)
    }
</script>

<canvas bind:this={canvas} width="255" height="255" on:mousedown={() => isClicked = true}></canvas>

<svelte:window on:mouseup={() => {isClicked=false}} on:mousemove={(e) => {if(isClicked) handleClick(e)}}/>