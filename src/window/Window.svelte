<script lang="ts">
    import { Color } from "../engine/Color";
    import { currentColor } from "../engine/ColorManager";
import { indexCount, windows, colorTarget } from "../store";
import ColorSelector from "./tabs/ColorSelector.svelte";
import Test from "./tabs/Test.svelte";
import { TabId } from "./TabType";
import { fade } from 'svelte/transition';
import Toolbar from "./tabs/Toolbar.svelte";
    import WindowNav from "./WindowNav.svelte";
    import WindowResizer from "./WindowResizer.svelte";
    import type WindowData from "./Window"

export let id: string;
let data:WindowData = $windows.get(id);

let window: HTMLDivElement;

</script>

<div 
bind:this={window} 
class="window"
style="top: {data.y}px; left: {data.x}px; height:{data.height}px; width:{data.width}px;" 
out:fade="{{duration:200}}"
on:mousedown={() => {window.style.zIndex=($indexCount+1).toString(); $indexCount++;}} 
class:isMoving={data.moving}
class:hovering={data.hovering}>


    <WindowNav bind:data={data}></WindowNav>

    <div class="content" class:tabless-content={!data.tabbed}>
        {#if data.tabs[data.selectedTab].type == TabId.ColorSelector}
            <ColorSelector on:colorchange={(e) => {$currentColor = Color.newFromHSV(e.detail[0], e.detail[1], e.detail[2]); $colorTarget = e.detail}} bind:colorTarget={$colorTarget}></ColorSelector>
        {:else if data.tabs[data.selectedTab].type == TabId.Test}
            <Test></Test>
        {:else if data.tabs[data.selectedTab].type == TabId.Toolbar}
            <Toolbar></Toolbar>
        {/if}
    </div>
    {#if data.resizeable}
    <WindowResizer bind:data={data}/>
    {/if}
</div>


<style lang="scss">

.window {
    position: fixed;
    background-color: rgba($color: #252525, $alpha: 0.8);
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