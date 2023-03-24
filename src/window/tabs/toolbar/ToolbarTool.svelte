<script lang="ts">

    import { currentTool, ToolType } from "src/engine/tool/ToolManager";

    export let tool: ToolType;
</script>

<button class:active={$currentTool == tool.tool} on:click={() => $currentTool = tool.tool}><img src="{tool.icon}" class="white filter" alt="toolimage"></button>


<style lang="scss">

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


.active {
    opacity: 1;
}

</style>