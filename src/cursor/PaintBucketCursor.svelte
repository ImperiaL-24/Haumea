<script lang="ts">
    import { modifierState } from "src/store";


    import EyedropperCursor from "./EyedropperCursor.svelte";
    import type { PaintBucketTool } from "src/engine/tool/PaintBucketTool";
    import type { Tool } from "src/engine/tool/Tool";
    export let instance: Tool;
    const tool = instance as PaintBucketTool;

</script>

{#if $modifierState.altKey}
    <EyedropperCursor instance={tool.eyedropper}/>
{:else}
    <img src="tools/paint_bucket.svg" alt="cursor">
{/if}

<style lang="scss">
    img {
        height: 18px;
        width: 18px;
        cursor: none;
        pointer-events: none;
        user-select: none;
        translate: -50% -50%;
        filter: drop-shadow(1px 0px 0 rgb(255, 255, 255))
        drop-shadow(0px 1px 0 rgb(255, 255, 255)) 
        drop-shadow(0px -1px 0 rgb(255, 255, 255)) 
        drop-shadow(-1px 0px 0 rgb(255, 255, 255));
    }
</style>