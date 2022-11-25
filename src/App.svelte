<script lang="ts">
    import Window from "./components/Window.svelte";
import { getImage } from "./engine/ColorSelector";
    import Toolbar from "./global/Toolbar.svelte";
    import { mousePos, mouseDelta } from './store'; 
    //import { invoke } from '@tauri-apps/api/tauri';
    let canvas: HTMLCanvasElement;
    let data: any;
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

        let setMousePos = (e) => {
        $mouseDelta = [e.clientX-$mousePos[0], e.clientY-$mousePos[1]]
        $mousePos = [e.clientX, e.clientY];
    }
</script>

<Toolbar />

<Window title="Color" x=10 y=20>
    <input bind:value={color} type="range" min="0" max="360" class="slider" />
<canvas width="255" height="255" bind:this={canvas} />
</Window>
<Window title="cf" x=100 y=20></Window>

<svelte:window on:mousemove={(e) => setMousePos(e)}></svelte:window>
