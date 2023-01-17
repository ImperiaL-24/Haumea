<script lang="ts">
    import type WindowData from "./window/WindowData";
    import Window from "./window/Window.svelte";
    import { mousePos, mouseDelta, windows, addWindow, currentWindow, windowRerender } from './store'; 
    import Toolbar from "./global/Toolbar.svelte";
    import { TabType } from "./window/TabType";
    import { currentColor } from "./engine/ColorManager";
    import Canvas from "./canvas/Canvas.svelte";
    
    let setMousePos = (e) => {
        $mouseDelta = [e.clientX-$mousePos[0], e.clientY-$mousePos[1]]
        $mousePos = [e.clientX, e.clientY];
    }
    let wind: Map<string, WindowData>;
    windows.subscribe(n => {
        wind=n;
    })
    // addWindow(TabType.ColorSelector, TabType.Test)
    // addWindow(TabType.Test)
    addWindow(TabType.ColorSelector);
    $: {
        console.log(wind)   
    }

</script>

<Toolbar />
<button on:click={() => console.log($currentColor)}>eee</button>
<div style="{`background-color:${$currentColor.asHex()}; width:100px; height:100px;`}"></div>
{#key $windowRerender}
    {#each [...wind] as window}
    <Window id={window[0]}></Window>
    {/each}
{/key}
<Canvas></Canvas>


<svelte:window on:mousemove={(e) => setMousePos(e)} on:mouseup={() => {$currentWindow="";}}></svelte:window>
