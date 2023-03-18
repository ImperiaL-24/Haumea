<script lang="ts">
import PencilCursor from "../cursor/PencilCursor.svelte";
import EyedropperCursor from "../cursor/EyedropperCursor.svelte";
import { ToolID } from "../engine/tool/Tool";
import { currentTool } from "../engine/tool/ToolManager";
import { clickState } from "../store";

import MoveCursor from "../cursor/MoveCursor.svelte";
import EraserCursor from "src/cursor/EraserCursor.svelte";

</script>

<div draggable="false" style="top:{$clickState.position.y}px; left:{$clickState.position.x}px;">
    {#if $currentTool.type == ToolID.EYEDROPPER_TOOL}
        <EyedropperCursor instance={$currentTool}/>
        {:else if $currentTool.type == ToolID.PENCIL_TOOL}
        <PencilCursor instance={$currentTool}/>
        {:else if $currentTool.type == ToolID.ERASER_TOOL}
        <EraserCursor instance={$currentTool}/>
        {:else if $currentTool.type == ToolID.MOVE_TOOL}
        <MoveCursor/>
    {/if}
</div>


<style lang="scss">
    div {
        position: fixed;
        cursor: none;
        pointer-events: none;
        z-index: 100000;
    }
</style>
