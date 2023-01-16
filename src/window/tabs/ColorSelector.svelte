<script lang="ts">
    import { currentColor } from "../../engine/ColorManager";


    import { getImage, hsvToRgb } from "../../engine/ColorSelector";
    let canvas: HTMLCanvasElement;
    let color = 0;

    $: {
        color;
        if(canvas!=null) {
            console.log("render");
            let ctx = canvas.getContext("2d");
            let idata = ctx.createImageData(255, 255);

            // set our buffer as source
            idata.data.set(getImage(color));

            // update canvas with new data
            ctx.putImageData(idata, 0, 0);
        }
        
    }
    let handleClick = (e) => {
        console.log(e.pageX-findPos(canvas).x+1, e.pageY-findPos(canvas).y+1);
        $currentColor = hsvToRgb(color,(e.pageX-findPos(canvas).x+1)/255,1-(e.pageY-findPos(canvas).y+1)/255);
    }

    function findPos(obj){
        const rect = obj.getBoundingClientRect();
        return {
            x: Math.floor(rect.left + window.scrollX),
            y: Math.floor(rect.top + window.scrollY)
        };

    }
</script>

<input bind:value={color} type="range" min="0" max="360" class="slider" />
<canvas width="255" height="255" bind:this={canvas} on:click={(e) => handleClick(e)}/>