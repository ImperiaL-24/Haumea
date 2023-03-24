<script lang="ts">
    import { ToolType } from "../../../engine/tool/ToolManager";
    import ToolbarTool from "./ToolbarTool.svelte";

</script>

<main>
    {#each Object.keys(ToolType) as tool}
        <ToolbarTool tool={ToolType[tool]}/>
    {/each}
    
</main>

<style lang="scss">
main {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    user-select: none;
}
</style>