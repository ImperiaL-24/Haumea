<script lang="ts">
    import { Color } from "../engine/Color";
    import { currentColor } from "../engine/ColorManager";
import { indexCount, mouseDelta, mouseClickDelta, currentWindow, windows, windowRerender, colorTarget } from "../store";
import ColorSelector from "./tabs/ColorSelector.svelte";
import Test from "./tabs/Test.svelte";
import { TabId } from "./TabType";
import { fade } from 'svelte/transition';
    import { clamp } from "../util";
    import WindowButton from "./WindowButton.svelte";

export let id: string;
let data = $windows.get(id);

let window: HTMLDivElement;

let initWidth = 0;
let initHeight = 0;
let initX = 0;
let initY = 0;

let tabspace: HTMLDivElement;

let move = () => {
    if(!data.moving) return;
    data.x+=$mouseDelta[0]
    data.y+=$mouseDelta[1];
    console.log(data.tabless);
}

let resize = () => {
    if(data.resizing=="none") return;

    if(data.resizing.includes("e")) {
        data.width = clamp(initWidth+$mouseClickDelta[0],240,1200);
    }
    if(data.resizing.includes("w")) {
        data.width = clamp(initWidth-$mouseClickDelta[0],240,1200);
        if(data.width<1200 && data.width>240)
        data.x = initX + $mouseClickDelta[0];
    }
    if(data.resizing.includes("n")) {
        data.height = clamp(initHeight-$mouseClickDelta[1],240,1200);
        if(data.height<1200 && data.height>240)
        data.y = initY + $mouseClickDelta[1];
    }
    if(data.resizing.includes("s")) {
        data.height = clamp(initHeight+$mouseClickDelta[1],240,1200);
    }
}

let resetPosCache = () => {
    initHeight = data.height;
    initWidth = data.width;
    initX = data.x;
    initY = data.y;
}

let windowEnter = () => {
    if($currentWindow=="" || $currentWindow == data.id || data.tabless || $windows.get($currentWindow).tabless) return;
    data.hovered = true;
    $windows.get($currentWindow).hovering = true;
}

let windowExit = () => {
    if($currentWindow=="" || $currentWindow == data.id || data.tabless || $windows.get($currentWindow).tabless) return;
    data.hovered = false;
    $windows.get($currentWindow).hovering = false;
}

let windowDrop = () => {
    if(!data.moving || data.tabless) return;

    for(let [_id, newWindow] of $windows) {
        if(!newWindow.hovered) continue;
        newWindow.tabs.push(...data.tabs);
        newWindow.hovered = false;

        $windows.delete(data.id)
        // window.parentNode.removeChild(window)
        console.log("new window!", newWindow)
        $windowRerender = !$windowRerender;
        return;  
    }
}

let wheel = (e) => {
    const delta = e.deltaY > 0 ? -50 : 50;
    tabspace.scrollBy(delta, 0); 
}
</script>

<div 
bind:this={window} 
class="window"
style="top: {data.y}px; left: {data.x}px; height:{data.height}px; width:{data.width}px;" 
out:fade="{{duration:200}}"
on:mousedown={() => {window.style.zIndex=($indexCount+1).toString(); $indexCount++;}} 
class:isMoving={data.moving}
class:hovering={data.hovering}>

    <nav 
    on:mousedown|self={() => {data.moving = true; $currentWindow=data.id}} 
    on:mouseenter={() => {windowEnter()}}
    on:mouseleave={() => {windowExit()}} 
    class:isHovered={data.hovered}
    class:isMoving={data.moving}
    class:tabless-nav={data.tabless}
    >
    <div class="bar"></div>
    {#if !data.tabless}
        <div class="tabspace" on:wheel={(e) => wheel(e)} bind:this={tabspace}>
            {#key $windows.get(id).selectedTab}
                {#each data.tabs as tab, i}
                <WindowButton tab={tab} selected={data.selectedTab==i} on:click={() => {data.selectedTab = i; console.log("click")}}></WindowButton>
                {/each}
            {/key}

        </div>
    {/if}
    </nav>


    <div class="content" class:tabless-content={data.tabless}>
        {#if data.tabs[data.selectedTab].type == TabId.ColorSelector}
            <ColorSelector on:colorchange={(e) => {$currentColor = Color.newFromHSV(e.detail[0], e.detail[1], e.detail[2]); $colorTarget = e.detail}} bind:colorTarget={$colorTarget}></ColorSelector>
        {:else if data.tabs[data.selectedTab].type == TabId.Test}
            <Test></Test>
        {:else if data.tabs[data.selectedTab].type == TabId.Toolbar}
            <Toolbar></Toolbar>
        {/if}
    </div>

    <div class="resize resize-left" class:resize-hover={data.resizing=="w"}  on:mousedown={() => {resetPosCache(); data.resizing = "w"}}></div>
    <div class="resize resize-right" class:resize-hover={data.resizing=="e"} on:mousedown={() => {resetPosCache(); data.resizing = "e"}}></div>
    <div class="resize resize-top" class:resize-hover={data.resizing=="n"}  on:mousedown={() => {resetPosCache(); data.resizing = "n"}}></div>
    <div class="resize resize-bottom" class:resize-hover={data.resizing=="s"} on:mousedown={() => {resetPosCache(); data.resizing = "s"}}></div>

    <div class="resize corner resize-top-left" class:resize-hover={data.resizing=="nw"} on:mousedown={() => {resetPosCache(); data.resizing = "nw"}}></div>
    <div class="resize corner resize-top-right" class:resize-hover={data.resizing=="ne"} on:mousedown={() => {resetPosCache(); data.resizing = "ne"}}></div>
    <div class="resize corner resize-bottom-left" class:resize-hover={data.resizing=="sw"} on:mousedown={() => {resetPosCache(); data.resizing = "sw"}}></div>
    <div class="resize corner resize-bottom-right" class:resize-hover={data.resizing=="se"} on:mousedown={() => {resetPosCache(); data.resizing = "se"}}></div>
</div>
<svelte:window on:mousemove={() => {move(); resize()}} on:mouseup={() => { windowDrop(); data.moving = false; data.resizing="none"}}></svelte:window>

<style lang="scss">

.corner {
    width: 8px;
    height: 8px;
}

.resize-top-left {
    top: -4px;
    left:-4px;
    cursor:nw-resize;
}

.resize-top-right {
    top: -4px;
    right:-4px;
    cursor:ne-resize;
}

.resize-bottom-left {
    bottom: -4px;
    left:-4px;
    cursor:ne-resize;
}

.resize-bottom-right {
    bottom: -4px;
    right:-4px;
    cursor:nw-resize;
}

.resize-left {
    height: 100%;
    width: 4px;
    top: 0;
    left: -4px;
    cursor:w-resize;
}

.resize-right {
    height: 100%;
    width: 4px;
    top: 0;
    right: -4px;
    cursor:w-resize;
}

.resize-top {
    height: 4px;
    width: 100%;
    top: -4px;
    left: 0px;
    cursor:n-resize;
}

.resize-bottom {
    height: 4px;
    width: 100%;
    bottom: -4px;
    left: 0px;
    cursor:n-resize;
}

.resize {
    position: absolute;
    background-color: #00000000;
    border-radius: 2px;
    transition: 0.2s background-color;
    
}

.resize-hover {
    background: var(--red);
}

.window {
    position: fixed;
    height: 400px;
    width: 400px;
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

nav {
    display: flex;
    flex-direction: column;
    align-items: center;
    user-select: none;
    width: 100%;
    height: 45px;
    border-radius: 10px;
    transition: all 0.2s, outline-width 0.05s;
    outline: var(--red) solid;
    outline-width: 0px;

    .bar {
        width: 100%;
        height: 15px;
        background-color: none;
        pointer-events: none;
        background-color: rgba($color: #161616, $alpha: 0.6);
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;
    }

    .tabspace {
        display: flex;
        align-items: center;
        height: 30px;
        overflow-x:overlay;
        width: 100%;
        background: linear-gradient(180deg, rgba(26, 26, 26, 0.6) 0%, rgba(0,0,0,0) 100%);
        transition: 0.2s all;
    }


}
.tabless-nav {
    height: 15px!important;
}

.tabless-content {
    height: calc(100% - 15px)!important;
}


.isMoving {
    pointer-events: none;
}

.isHovered {
    outline-width: 2px;
}

.hovering {
    opacity: 0.6;
}
</style>