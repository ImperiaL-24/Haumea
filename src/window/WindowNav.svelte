<script lang="ts">
    import { currentWindow, mouseDelta, windowRerender, windows } from "../store";
    import WindowButton from "./WindowButton.svelte";
    import type Window from "./Window";

    let windowEnter = () => {
    if($currentWindow=="" || $currentWindow == data.id || !data.tabbed || !$windows.get($currentWindow).tabbed) return;
    data.hovered = true;
    $windows.get($currentWindow).hovering = true;
}

let windowExit = () => {
    if($currentWindow=="" || $currentWindow == data.id || !data.tabbed || !$windows.get($currentWindow).tabbed) return;
    data.hovered = false;
    $windows.get($currentWindow).hovering = false;
}
let wheel = (e) => {
    const delta = e.deltaY > 0 ? -50 : 50;
    tabspace.scrollBy(delta, 0); 
}
let move = () => {
    if(!data.moving) return;
    data.x+=$mouseDelta[0]
    data.y+=$mouseDelta[1];
}

let windowDrop = () => {
    if(!data.moving || !data.tabbed) return;

    for(let [_id, newWindow] of $windows) {
        if(!newWindow.hovered) continue;
        newWindow.tabs.push(...data.tabs);
        newWindow.hovered = false;

        $windows.delete(data.id)
        console.log("new window!", newWindow)
        $windowRerender = !$windowRerender;
        return;  
    }
}
    export let data: Window;
    let tabspace;
</script>

<nav 
on:mousedown|self={() => {data.moving = true; $currentWindow=data.id}} 
on:mouseenter={() => {windowEnter()}}
on:mouseleave={() => {windowExit()}} 
class:isHovered={data.hovered}
class:isMoving={data.moving}
class:tabless-nav={!data.tabbed}
>
<div class="bar"></div>
{#if data.tabbed}
    <div class="tabspace" on:wheel={(e) => wheel(e)} bind:this={tabspace}>
        {#each data.tabs as tab, i}
            <WindowButton bind:data={data} tab={tab} index={i} on:click={() => {data.selectedTab = i; console.log("click")}}></WindowButton>
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
        background-color: rgba($color: #161616, $alpha: 0.6);
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