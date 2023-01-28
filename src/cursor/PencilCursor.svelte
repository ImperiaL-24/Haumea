<script lang="ts">
import type { PencilTool } from "../engine/tool/PencilTool";
import { modifierState } from "../store";
import {zoom} from "../engine/canvas/Canvas";
import EyedropperCursor from "./EyedropperCursor.svelte";
    import type { Tool } from "src/engine/tool/Tool";

export let instance: Tool;
const tool = instance as PencilTool;
let cursorSize: number;
$: {
    tool.size.subscribe(n => {
        cursorSize = $zoom*n;
    });
}
</script>
{#if $modifierState.altKey}
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