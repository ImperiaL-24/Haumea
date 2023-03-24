<script lang="ts">
import PencilCursor from "../cursor/PencilCursor.svelte";
import EyedropperCursor from "../cursor/EyedropperCursor.svelte";
import { ToolID } from "../engine/tool/Tool";
import { currentTool, ToolType } from "../engine/tool/ToolManager";
import { clickState } from "../store";

import EraserCursor from "src/cursor/EraserCursor.svelte";
    import CursorCursor from "src/cursor/CursorCursor.svelte";
    import MoveCursor from "src/cursor/MoveCursor.svelte";

</script>

<div draggable="false" style="top:{$clickState.position.y}px; left:{$clickState.position.x}px;">
    {#if $currentTool.type == ToolType.EYEDROPPER_TOOL}
        <EyedropperCursor instance={$currentTool}/>
        {:else if $currentTool.type == ToolType.PENCIL_TOOL}
        <PencilCursor instance={$currentTool}/>
        {:else if $currentTool.type == ToolType.ERASER_TOOL}
        <EraserCursor instance={$currentTool}/>
        {:else if $currentTool.type == ToolType.CURSOR_TOOL}
        <CursorCursor/>
        {:else if $currentTool.type == ToolType.MOVE_TOOL}
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
