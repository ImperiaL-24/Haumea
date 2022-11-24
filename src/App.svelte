<script lang="ts">
    import { getImage } from "./engine/ColorSelector";
    import Toolbar from "./global/Toolbar.svelte";
    //import { invoke } from '@tauri-apps/api/tauri';
    let canvas: HTMLCanvasElement;
    let data: any;
    let color = 0;

    $: {
        color;
        if(canvas!=null) {
            let ctx = canvas.getContext("2d");
            let idata = ctx.createImageData(255, 255);

            // set our buffer as source
            idata.data.set(getImage(color));

            // update canvas with new data
            ctx.putImageData(idata, 0, 0);
        }
        
    }
</script>

<Toolbar />
<input bind:value={color} type="range" min="0" max="360" class="slider" />
<canvas width="255" height="255" bind:this={canvas} />
