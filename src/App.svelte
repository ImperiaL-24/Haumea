<script lang="ts">
    import Window from "./window/Window.svelte";
    import { mousePos, mouseDelta, windows, currentWindow, windowRerender, isClicking, mouseClickDelta } from './store'; 
    import Navbar from "./global/Navbar.svelte";
    import { TabType } from "./window/TabType";
    import Canvas from "./canvas/Canvas.svelte";
    import { processKey } from "./engine/KeybindManager";
    import { WindowBuilder } from "./window/Window";
    import Anchor from "./window/anchor/Anchor.svelte";
    import { onMount } from "svelte";
    
    let setMousePos = (e) => {
        $mouseDelta = [e.clientX-$mousePos[0], e.clientY-$mousePos[1]]
        $mousePos = [e.clientX, e.clientY];
        if($isClicking) {
            $mouseClickDelta = [$mouseClickDelta[0]+$mouseDelta[0],$mouseClickDelta[1]+$mouseDelta[1]]
        }
    }
    onMount(() => {
        new WindowBuilder(TabType.ColorSelector).add();
        new WindowBuilder(TabType.Toolbar).resizeable(false).size(40, 255).add();
    })

</script>

<Navbar />
<div class="test">
    {#key $windowRerender}
        {#each [...$windows] as window}
        <Window id={window[0]}></Window>
        {/each}
    {/key}
    <Canvas></Canvas>
    <Anchor></Anchor>
</div>

<svelte:window on:mousemove={(e) => setMousePos(e)} on:mouseup={() => {$currentWindow=""; $isClicking = false}} on:mousedown={() => {$isClicking = true; $mouseClickDelta = [0,0]}}  on:keydown={(e) => processKey(e)}></svelte:window>

<style lang="scss">
    .test {
        position: relative;
        height: calc(100vh - 38px);
        margin-top: 38px;
    }
</style>
