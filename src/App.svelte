<script lang="ts">
    import type WindowData from "./window/WindowData";
    import Window from "./window/Window.svelte";
    import { mousePos, mouseDelta, windows, addWindow, currentWindow, windowRerender, isClicking, mouseClickDelta } from './store'; 
    import Toolbar from "./global/Toolbar.svelte";
    import { TabType } from "./window/TabType";
    import Canvas from "./canvas/Canvas.svelte";
    import { processKey } from "./engine/KeybindManager";
    
    let setMousePos = (e) => {
        $mouseDelta = [e.clientX-$mousePos[0], e.clientY-$mousePos[1]]
        $mousePos = [e.clientX, e.clientY];
        if($isClicking) {
            $mouseClickDelta = [$mouseClickDelta[0]+$mouseDelta[0],$mouseClickDelta[1]+$mouseDelta[1]]
            console.log($mouseClickDelta)
        }
    }
    let wind: Map<string, WindowData>;
    windows.subscribe(n => {
        wind=n;
    })
    // addWindow(TabType.ColorSelector, TabType.Test)
    addWindow(TabType.Test)
    addWindow(TabType.ColorSelector);
    $: {
        console.log(wind)   
    }

</script>

<Toolbar />
{#key $windowRerender}
    {#each [...wind] as window}
    <Window id={window[0]}></Window>
    {/each}
{/key}
<Canvas></Canvas>


<svelte:window on:mousemove={(e) => setMousePos(e)} on:mouseup={() => {$currentWindow=""; $isClicking = false}} on:mousedown={() => {$isClicking = true; $mouseClickDelta = [0,0]}}  on:keydown={(e) => processKey(e)}></svelte:window>
