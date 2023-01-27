<script lang="ts">
    import PencilCursor from "../cursor/PencilCursor.svelte";
import EyedropperCursor from "../cursor/EyedropperCursor.svelte";
import { ToolID, ToolType } from "../engine/tool/Tool";
    import { currentTool } from "../engine/tool/ToolManager";
    import { mousePos } from "../store";


    let src: string = "cursor.png";
    $: {
        src = ToolType[$currentTool.type].icon;
    }
</script>

<div draggable="false" style="top:{$mousePos[1]}px; left:{$mousePos[0]}px;">
    {#if $currentTool.type == ToolID.EYEDROPPER_TOOL}
        <EyedropperCursor/>
        {:else if $currentTool.type == ToolID.PENCIL_TOOL}
        <PencilCursor/>
    {/if}
</div>


<style lang="scss">
    div {
        position: fixed;
        cursor: none;
        pointer-events: none;
    }
</style>
