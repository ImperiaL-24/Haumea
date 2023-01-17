<script lang="ts">
import { indexCount, mouseDelta, currentWindow, windows, windowRerender } from "../store";
import ColorSelector from "./tabs/ColorSelector.svelte";
import Test from "./tabs/Test.svelte";
import { TabId } from "./TabType";

export let id: string;
let data = $windows.get(id);

let window: HTMLDivElement;

let move = () => {
    if(!data.moving) return;
    data.x+=$mouseDelta[0]
    data.y+=$mouseDelta[1]
}

let windowEnter = () => {
    if($currentWindow=="" || $currentWindow == data.id) return;
    data.hovered = true;
}

let windowExit = () => {
    if($currentWindow=="" || $currentWindow == data.id) return;
    data.hovered = false;
}

let windowDrop = () => {
    console.log($currentWindow)
    if(!data.moving) return;

    for(let [_id, newWindow] of $windows) {
        if(!newWindow.hovered) continue;
        newWindow.tabs.push(...data.tabs);
        newWindow.hovered = false;

        $windows.delete(data.id)
        window.parentNode.removeChild(window)
        console.log("new window!", newWindow)
        $windowRerender = !$windowRerender;
        return;  
    }
}
</script>

<div bind:this={window} class="window"
style="top: {data.y}px; left: {data.x}px;" 
on:mousedown={() => {window.style.zIndex=($indexCount+1).toString(); $indexCount++;}} 
class:isMoving={data.moving}>

    <nav 
    on:mousedown|self={() => {data.moving = true; $currentWindow=data.id}} 
    on:mouseenter={() => {windowEnter()}}
    on:mouseleave={() => {windowExit()}} 
    class:isMoving={data.moving}
    class:isHovered={data.hovered}>

        {#each data.tabs as tab, i}
            <button on:click={() => {data.selectedTab = i}} class:selected={i==data.selectedTab}>{tab.title}</button>
        {/each}
    </nav>
    <div class="content">
        {#if data.tabs[data.selectedTab].type == TabId.ColorSelector}
        <ColorSelector></ColorSelector>
        {:else if data.tabs[data.selectedTab].type == TabId.Test}
            <Test></Test>
        {/if}
    </div>


</div>
<svelte:window on:mousemove={() => move()} on:mouseup={() => { windowDrop(); data.moving = false; }}></svelte:window>

<style lang="scss">
.window {
    position: fixed;
    height: 400px;
    width: 400px;
    background-color: rgba($color: #252525, $alpha: 0.6);
    backdrop-filter: blur(12px);
    box-shadow: 0px 0px 5px #000;
    border-radius: 10px;

    .content {
        width: 100%;
        height: calc(100% - 38px);
    }
}

nav {
    display: flex;
    align-items: center;
    user-select: none;
    width: 100%;
    height: 38px;
    border-radius: 10px;
    background-color: rgba($color: #141414, $alpha: 0.6);
    transition: all 0.2s;
    button {
        border: none;
        border-radius: 10px;
        color: var(--lightest);
        font-family: 'Poppins';
        font-size: 16px;
        margin: 0;
        padding: 0px 20px;
        height: 100%;
        text-align: center;
        background-color: rgba($color: #0f0f0f, $alpha: 0.0);
        transition: all 0.2s;
    }
}

.selected {
    color: var(--lighter);
    background-color: rgba($color: #0f0f0f, $alpha: 0.6);
}

.isMoving {
    pointer-events: none;
}

.isHovered {
    background-color: var(--red);
    opacity: 0.4;
}
</style>