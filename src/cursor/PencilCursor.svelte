<script lang="ts">
import type { PencilTool } from "../engine/tool/PencilTool";
import { clickState, modifierState } from "../store";
import EyedropperCursor from "./EyedropperCursor.svelte";
import type { Tool } from "src/engine/tool/Tool";
    import { App, CanvasProjectTab } from "haumea/tab";
    import { get } from "svelte/store";

export let instance: Tool;
const tool = instance as PencilTool;
let cursorSize: number;

$$: App.activeTabChange => let activeCanvas: CanvasProjectTab = App.activeCanvas;

$$: $: activeCanvas?.zoomChange => let zoom = activeCanvas.zoom;

$: {
    tool.size.subscribe(n => {
        cursorSize = zoom*n;
    });
}
</script>
{#if $modifierState.altKey && !$clickState.rightClick}
    <EyedropperCursor instance={tool.eyedropper}/>
{:else}
    <div class="main" style="height: {cursorSize}px; width: {cursorSize}px;">
        <div class="linex"></div>
        <div class="liney"></div>
    </div>
{/if}
<style lang="scss">
    .main {
        position: relative;
        height: 18px;
        width: 18px;
        translate: -50% -50%;
        background-color: none;
        transition: all 0.2s;
        border: 1px solid white;
        box-shadow:inset 0px 0px 0px 1px rgb(0, 0, 0);
        border-radius: 5%;

        display: flex;
        justify-content: center;
        align-items: center;
    }
    .linex {
        position: absolute;
        height: 1px;
        width: 15%;
        border: 1px solid white;
        box-shadow:inset 0px 0px 0px 1px rgb(0, 0, 0);
    }
    .liney {
        position: absolute;
        height: 15%;
        width: 1px;
        border: 1px solid white;
        box-shadow:inset 0px 0px 0px 1px rgb(0, 0, 0);
    }
</style>