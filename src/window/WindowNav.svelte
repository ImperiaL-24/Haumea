<script lang="ts">
    import { clickState } from "src/store";
    import WindowButton from "./WindowButton.svelte";
    import {currentWindow,currentWindowId, removeWindow, windows, type WindowData} from 'haumea/window'

    let windowEnter = () => {
    if($currentWindow == undefined || $currentWindow.id == data.id || !data.tabbed || !$currentWindow.tabbed) return;
    data.hovered = true;
    // update this somehow;
    $windows.get($currentWindowId)
    $windows.get($currentWindowId).hovering = true;
}

let windowExit = () => {
    if($currentWindow== undefined || $currentWindow.id == data.id || !data.tabbed || !$currentWindow.tabbed) return;
    data.hovered = false;
    $windows.get($currentWindowId).hovering = false;
}
let wheel = (e) => {
    const delta = e.deltaY > 0 ? -50 : 50;
    tabspace.scrollBy(delta, 0); 
}
let move = () => {
    if(!data.moving) return;
    data.position=data.position.add($clickState.delta);
}

let windowDrop = () => {
    if(!data.moving || !data.tabbed) return;

    for(let [_id, newWindow] of $windows) {
        if(!newWindow.hovered) continue;
        newWindow.tabs.push(...data.tabs);
        newWindow.hovered = false;
        removeWindow(data);
        // $windows.delete(data.id)
        console.log("new window!", newWindow)
        return;  
    }
}
    export let data: WindowData;
    let tabspace;
</script>

<nav 
on:mousedown|self={() => {data.moving = true; $currentWindowId=data.id}} 
on:mouseenter={() => {windowEnter()}}
on:mouseleave={() => {windowExit()}} 
class:isHovered={data.hovered}
class:isMoving={data.moving}
class:tabless-nav={!data.tabbed}
>
<div class="bar"></div>
{#if data.tabbed}
    <div class="tabspace" on:wheel|passive={(e) => wheel(e)} bind:this={tabspace}>
        {#each data.tabs as tab, i}
            <WindowButton selected={data.selectedTab==i} title={tab.title} on:click={() => {data.selectedTab = i}}></WindowButton>
        {/each}
    </div>
{/if}
</nav>

<svelte:window on:mousemove={() => {move()}} on:mouseup={() => { windowDrop(); data.moving = false; data.resizing="none"}}></svelte:window>

<style lang="scss">
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
        background-color: rgba($color: #111213, $alpha: 0.6);
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;
    }

    .tabspace {
        display: flex;
        align-items: center;
        justify-content: center;
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

.isHovered {
    outline-width: 2px;
}
</style>