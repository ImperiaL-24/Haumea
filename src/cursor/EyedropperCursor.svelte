<script lang="ts">
    import { clickState, modifierState } from "../store";
    import {zoom} from "../engine/canvas/Canvas";
    import {currentTool} from "../engine/tool/ToolManager";
    import type { Color } from "../engine/Color";
    import type { EyedropperTool } from "../engine/tool/EyedropperTool";
    import { fade } from "svelte/transition";
    import type { Tool } from "../engine/tool/Tool";
    export let instance: Tool;
    const tool = instance as EyedropperTool;
    let oldColor: Color;
    let newColor: Color;
    $: {
        tool.newColor.subscribe(n => {
            newColor = n;
        });
        tool.originalColor.subscribe(n => {
            oldColor = n;
        });
    }
</script>


<img src="tools/eyedropper.svg" alt="cursor">
{#if oldColor !=undefined && newColor != undefined && $clickState.leftClick}
    <div 
    in:fade="{{duration:50}}"  
    out:fade="{{duration:50}}" 
    class="color-circle" style="border-top-color: {oldColor.asHex()}; border-left-color: {oldColor.asHex()}; border-right-color: {newColor.asHex()}; border-bottom-color: {newColor.asHex()};"></div>
{/if}
<style lang="scss">
    img {
        position: absolute;
        height: 18px;
        width: 18px;
        cursor: none;
        pointer-events: none;
        user-select: none;
        translate: 0% -100%;
        filter: drop-shadow(1px 0px 0 rgb(255, 255, 255))
        drop-shadow(0px 1px 0 rgb(255, 255, 255)) 
        drop-shadow(0px -1px 0 rgb(255, 255, 255)) 
        drop-shadow(-1px 0px 0 rgb(255, 255, 255));
        z-index: 1;
        
    }

    .color-circle {
        position: absolute;
        width: 25px;
        height: 25px;
        border-radius: 50%;
        border: 5px solid;
        translate: -50% -50%;
        filter: drop-shadow(0px 0px 5px rgba(0, 0, 0, 0.5));
        transition: 0.2s all;
    }
</style>