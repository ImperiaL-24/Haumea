<script lang="ts">
import PencilCursor from "../cursor/PencilCursor.svelte";
import EyedropperCursor from "../cursor/EyedropperCursor.svelte";
import { currentTool, ToolType } from "../engine/tool/ToolManager";
import { clickState } from "../store";

import EraserCursor from "src/cursor/EraserCursor.svelte";
    import CursorCursor from "src/cursor/CursorCursor.svelte";
    import MoveCursor from "src/cursor/MoveCursor.svelte";

</script>

<div draggable="false" style="top:{$clickState.position.y}px; left:{$clickState.position.x}px;">
    {#if $currentTool.type == ToolType.EYEDROPPER_TOOL.type}
        <EyedropperCursor instance={$currentTool}/>
        {:else if $currentTool.type == ToolType.PENCIL_TOOL.type}
        <PencilCursor instance={$currentTool}/>
        {:else if $currentTool.type == ToolType.ERASER_TOOL.type}
        <EraserCursor instance={$currentTool}/>
        {:else if $currentTool.type == ToolType.CURSOR_TOOL.type}
        <CursorCursor/>
        {:else if $currentTool.type == ToolType.MOVE_TOOL.type}
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
