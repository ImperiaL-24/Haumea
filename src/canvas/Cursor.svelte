<script lang="ts">
    import PencilCursor from "../cursor/PencilCursor.svelte";
import EyedropperCursor from "../cursor/EyedropperCursor.svelte";
import { ToolID } from "../engine/tool/Tool";
import {ToolType} from "../engine/tool/ToolManager"
    import { currentTool } from "../engine/tool/ToolManager";
    import { clickState } from "../store";
    import type { FolderPlusIcon } from "svelte-feather-icons";


    let src: string = "cursor.png";
    $: {
        src = ToolType[$currentTool.type].icon;
    }
</script>

<div draggable="false" style="top:{$clickState.position.y}px; left:{$clickState.position.x}px;">
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
        z-index: 100000;
    }
</style>
