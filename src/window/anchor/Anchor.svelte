<script lang="ts">
    import { currentWindow, windows, windowRerender } from "../../store";
    import { AnchorBuilder } from "./Anchor";

    let hovered: boolean;
    let hoveredWindowId: string = "";
    export let position: "left" | "right" | "bottom" = "right";
    let windowEnter = () => { 
        if($currentWindow=="") return;
        console.log($windows.get($currentWindow))
        hovered = true;
        hoveredWindowId = $currentWindow;
    }

    let windowLeave = () => {
        if($currentWindow=="") return;
        console.log($windows.get($currentWindow))
        hovered = false;
        hoveredWindowId = "";
    }

    let windowDrop = () => {
        if(hoveredWindowId=="") return;
        hovered = false;
        
        $windowRerender = !$windowRerender;
        new AnchorBuilder(hoveredWindowId).position(position).add();
        $windows.get(hoveredWindowId).anchored=true;
        hoveredWindowId="";
    }
    
</script>

<div class:hovered={hovered} class="anchor-drop {position}" class:no-mouse={$currentWindow==""} on:mouseenter={(e) => windowEnter()} on:mouseleave={(e) => windowLeave()}></div>

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