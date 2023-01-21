<script lang="ts">
    import Window from "./window/Window.svelte";
    import { mousePos, mouseDelta, windows, currentWindow, windowRerender, isClicking, mouseClickDelta, anchors, innerRect } from './store'; 
    import Navbar from "./global/Navbar.svelte";
    import { TabType } from "./window/TabType";
    import Canvas from "./canvas/Canvas.svelte";
    import { processKey } from "./engine/KeybindManager";
    import { WindowBuilder } from "./window/Window";
    import Anchor from "./window/anchor/Anchor.svelte";
    import { onMount } from "svelte";
    import AnchorColumn from "./window/anchor/AnchorColumn.svelte";
    
    let setMousePos = (e) => {
        $mouseDelta = [e.clientX-$mousePos[0], e.clientY-$mousePos[1]]
        $mousePos = [e.clientX, e.clientY];
        if($isClicking) {
            $mouseClickDelta = [$mouseClickDelta[0]+$mouseDelta[0],$mouseClickDelta[1]+$mouseDelta[1]]
        }
    }
    onMount(() => {
        new WindowBuilder(TabType.ColorSelector).add();
        new WindowBuilder(TabType.ColorSelector).add();
        new WindowBuilder(TabType.Toolbar).resizeable(false).size(40, 255).add();
    })

    $: {
        $anchors;
        let rect= {x:0,y:0,height:0,width:0};

        for(let [_id, anchor] of $anchors) {
            if(!anchor.resizeable) continue;
            if(anchor.position=="left") {
                rect.width+=anchor.size;
                rect.x+=anchor.size;
            }
            if(anchor.position=="right") {
                rect.width+=anchor.size;
            }
            if(anchor.position=="bottom") {
                rect.height+=anchor.size;
            }
        }
        $innerRect = rect;
    }
</script>

<Navbar />
<div class="test">
    {#key $windowRerender}
        {#each [...$windows] as window}
            {#if !window[1].anchored}
                <Window id={window[0]}></Window>
            {/if}
        {/each}
    {/key}
    <Canvas></Canvas>
    <Anchor></Anchor>
    <Anchor position="left"></Anchor>
    <Anchor position="bottom"></Anchor>
    {#each [...$anchors] as anchor}
        <AnchorColumn id={anchor[0]}></AnchorColumn>
        {/each}
</div>

<svelte:window on:mousemove={(e) => setMousePos(e)} on:mouseup={() => {$currentWindow=""; $isClicking = false}} on:mousedown={() => {$isClicking = true; $mouseClickDelta = [0,0]}}  on:keydown={(e) => processKey(e)}></svelte:window>

<style lang="scss">
    .test {
        position: relative;
        height: calc(100vh - 38px);
        margin-top: 38px;
    }
</style>
