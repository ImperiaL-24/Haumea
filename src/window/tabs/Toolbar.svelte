<script lang="ts">
    import { ToolType } from "../../engine/tool/ToolManager";
    import { currentTool } from "../../engine/tool/ToolManager";

</script>

<main>
    <button class:active={$currentTool == ToolType.MOVE_TOOL.tool} on:click={() => $currentTool = ToolType.MOVE_TOOL.tool}><img src="tools/move.svg" class="white filter" alt="toolimage"></button>
    <button class:active={$currentTool == ToolType.PENCIL_TOOL.tool} on:click={() => $currentTool = ToolType.PENCIL_TOOL.tool}><img src="tools/pencil.svg" class="white filter" alt="toolimage"></button>
    <button class:active={$currentTool == ToolType.ERASER_TOOL.tool} on:click={() => $currentTool = ToolType.ERASER_TOOL.tool}><img src="tools/eraser_tool.svg" class="white filter" alt="toolimage"></button>
    <button class:active={$currentTool == ToolType.CROP_TOOL.tool} on:click={() => $currentTool = ToolType.CROP_TOOL.tool}><img src="tools/crop.svg" class="white filter" alt="toolimage"></button>
    <button class:active={$currentTool == ToolType.PAINT_BUCKET_TOOL.tool} on:click={() => $currentTool = ToolType.PAINT_BUCKET_TOOL.tool}><img src="tools/paint_bucket.svg" class="white filter" alt="toolimage"></button>
    <button class:active={$currentTool == ToolType.EYEDROPPER_TOOL.tool} on:click={() => $currentTool = ToolType.EYEDROPPER_TOOL.tool}><img src="tools/eyedropper.svg" class="white filter" alt="toolimage"></button>
    <button class:active={$currentTool == ToolType.ROTATE_TOOL.tool} on:click={() => $currentTool = ToolType.ROTATE_TOOL.tool}><img src="tools/rotate.svg" class="white filter" alt="toolimage"></button>
</main>

<style lang="scss">
main {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    user-select: none;
    button {
        width: 100%;
        height: 40px;
        background: none;
        border: none;
        transition: 0.2s all;
        opacity: 0.5;
        img {
            height: 70%;
            width: 70%;
            filter: invert(100%);
        }
        &:hover {
            opacity: 0.7;
        }
    }
}

.active {
    opacity: 1;
}

</style>