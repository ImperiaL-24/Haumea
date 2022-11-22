<script lang="ts">
  import Toolbar from './global/Toolbar.svelte';
  import { invoke } from '@tauri-apps/api/tauri';
  let canvas: HTMLCanvasElement;
  let data: any;
  let color=0;

  let update_color = async (color) => {

    let val = await invoke("get_image", {hue: color});
    data = val;

  }
</script>

<Toolbar></Toolbar>
<input bind:value={color}  type="range" min="0" max="360" class="slider">
<canvas width="255" height="255" bind:this={canvas}/>
<!-- svelte-ignore empty-block -->
<img src={data}>
{#await update_color(color) then _}

{/await}