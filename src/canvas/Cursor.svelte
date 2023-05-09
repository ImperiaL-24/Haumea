<script lang="ts">
import PencilCursor from "../cursor/PencilCursor.svelte";
import EyedropperCursor from "../cursor/EyedropperCursor.svelte";
import { currentTool, ToolType } from "../engine/tool/ToolManager";
import { clickState, modifierState } from "../store";

import EraserCursor from "src/cursor/EraserCursor.svelte";
    import CursorCursor from "src/cursor/CursorCursor.svelte";
    import MoveCursor from "src/cursor/MoveCursor.svelte";
    import PaintBucketCursor from "src/cursor/PaintBucketCursor.svelte";

</script>

<div draggable="false" style="top:{$clickState.position.y}px; left:{$clickState.position.x - (($currentTool.type == "PENCIL_TOOL" || $currentTool.type == "ERASER_TOOL") && $clickState.rightClick && $modifierState.altKey ? $clickState.rightClickDelta.x : 0)}px;">
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
        {:else if $currentTool.type == ToolType.PAINT_BUCKET_TOOL.type}
        <PaintBucketCursor instance={$currentTool}/>
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
