<script lang="ts">
import {v4 as uuidv4} from "uuid";
import { indexCount, mouseDelta, currentWindow } from "../store";
import ColorSelector from "./tabs/ColorSelector.svelte";
import Test from "./tabs/Test.svelte";
import { TabId, type TabType } from "./TabType";

export let x: string = "0";
export let y: string = "0";
export let tabData: TabType[];

const id = uuidv4();

let selectedTab = 0;

let window: HTMLDivElement;
let moving: boolean = false;
let move = () => {
    if(!moving) return;
    x=(parseInt(x)+$mouseDelta[0]).toString()
    y=(parseInt(y)+$mouseDelta[1]).toString()
}
</script>

<div bind:this={window} style="top: {y}px; left: {x}px;" on:mousedown={() => {window.style.zIndex=($indexCount+1).toString(); $indexCount++;}} class:isMoving={moving}>
    <nav on:mousedown|self={() => {moving = true; $currentWindow=id}} on:mouseenter={() => {if($currentWindow!="" && $currentWindow != id) console.log($currentWindow, id)}} class:isMoving={moving}>
        {#each tabData as tab, i}
            <button on:click={() => {selectedTab = i}} class:selected={i==selectedTab}>{tab.title}</button>
        {/each}
    </nav>

    {#if tabData[selectedTab].type == TabId.ColorSelector}
        <ColorSelector></ColorSelector>
    {:else if tabData[selectedTab].type == TabId.Test}
        <Test></Test>
    {/if}

</div>
<svelte:window on:mousemove={() => move()} on:mouseup={() => {moving = false; $currentWindow=""}}></svelte:window>

<style lang="scss">
    div {
        position: fixed;
        height: 400px;
        width: 300px;
        background-color: rgba($color: #252525, $alpha: 0.6);
        backdrop-filter: blur(12px);
        box-shadow: 0px 0px 5px #000;
        border-radius: 10px;
    }
nav {
    display: flex;
    align-items: center;
    user-select: none;
    width: 100%;
    height: 38px;
    border-radius: 10px;
    background-color: rgba($color: #141414, $alpha: 0.6);
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
</style>