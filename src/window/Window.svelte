<script lang="ts">

import { colorTarget } from "src/store";
import ColorSelector from "./tabs/ColorSelector.svelte";
import Test from "./tabs/Test.svelte";

import { fade } from 'svelte/transition';
import Toolbar from "./tabs/toolbar/Toolbar.svelte";
import WindowNav from "./WindowNav.svelte";
import WindowResizer from "./WindowResizer.svelte";
import {TabId, indexCount, windows, type WindowData} from 'src/haumea/window'
    import Layers from "./tabs/layer/Layers.svelte";

export let id: string;
let data:WindowData = $windows.get(id);

let window: HTMLDivElement;

</script>

<div 
bind:this={window} 
class="window"
style="top: {data.anchored ? !data.resizeable ? "calc(50% - 127.5px)": "0px" : data.position.y+"px"}; left: {data.anchored ? 0 : data.position.x}px; height:{data.anchored && data.resizeable ? "100%" : data.height+"px"}; width:{data.anchored && data.resizeable ? "100%" : data.width+"px"};" 
out:fade="{{duration:200}}"
on:mousedown={() => {window.style.zIndex=($indexCount+1).toString(); $indexCount++;}} 
class:isMoving={data.moving}
class:hovering={data.hovering}>


    <WindowNav bind:data={data}></WindowNav>

    <div class="content" class:tabless-content={!data.tabbed}>
        {#if data.tabs[data.selectedTab].type == TabId.ColorSelector}
            <ColorSelector bind:colorTarget={$colorTarget}></ColorSelector>
        {:else if data.tabs[data.selectedTab].type == TabId.Test}
            <Test></Test>
        {:else if data.tabs[data.selectedTab].type == TabId.Toolbar}
            <Toolbar></Toolbar>
        {:else if data.tabs[data.selectedTab].type == TabId.Layers}
            <Layers></Layers>
        {/if}
    </div>
    {#if data.resizeable && !data.anchored}
    <WindowResizer bind:data={data}/>
    {/if}
</div>


<style lang="scss">

.window {
    position: absolute;
    background-color: rgba(30, 33, 37, 0.800);
    backdrop-filter: blur(12px);
    box-shadow: 0px 0px 5px #000;
    border-radius: 5px;
    z-index: 5;
    .content {
        width: 100%;
        height: calc(100% - 45px);
    }
    transition: opacity 0.2s, outline-width 0.1s;

}

.tabless-content {
    height: calc(100% - 15px)!important;
}

.isMoving {
    pointer-events: none;
}

.hovering {
    opacity: 0.6;
}
</style>