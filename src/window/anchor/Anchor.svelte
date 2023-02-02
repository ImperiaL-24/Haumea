<script lang="ts">
    import {currentWindow, windows } from 'haumea/window'
    import { AnchorBuilder } from "haumea/anchor";

    let hovered: boolean;
    let hoveredWindowId: string = "";
    export let position: "left" | "right" | "bottom" = "right";
    let windowEnter = () => { 
        if($currentWindow == undefined) return;
        console.log($currentWindow)
        hovered = true;
        hoveredWindowId = $currentWindow.id;
    }

    let windowLeave = () => {
        if($currentWindow == undefined) return;
        console.log($currentWindow)
        hovered = false;
        hoveredWindowId = "";
    }

    let windowDrop = () => {
        if(hoveredWindowId=="") return;
        hovered = false;
        
        new AnchorBuilder(hoveredWindowId).position(position).add();
        $windows.get(hoveredWindowId).anchored=true;
        hoveredWindowId="";
    }
    
</script>

<div class:hovered={hovered} class="anchor-drop {position}" class:no-mouse={$currentWindow==undefined} on:mouseenter={(e) => windowEnter()} on:mouseleave={(e) => windowLeave()}></div>

<svelte:window  on:mouseup={() => { windowDrop()}}></svelte:window>

<style lang="scss">
    .anchor-drop {
        position: absolute;
        width: 150px;
        height: calc(100% - 20px);
        background: none;
        margin: 10px;
        transition: all 0.2s;
        border-radius: 5px;
    }

    .hovered {
        background-color: var(--red);
    }

    .right {
        top: 0;
        right: 0;
    }

    .left {
        top: 0;
        left: 0;
    }

    .bottom {
        height: 150px;
        width: calc(100% - 20px);
        bottom: 0;
    }

    .no-mouse {
        pointer-events: none;
    }
</style>