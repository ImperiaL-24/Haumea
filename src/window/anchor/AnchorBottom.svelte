<script lang="ts">
    import { anchors, innerRect } from "src/store";
    import Window from "../Window.svelte";
    import type Anchor from "./Anchor";
    export let id: string;

    let data: Anchor = $anchors.get(id);

</script>

<div style="width:calc(100% - {$innerRect.width+30}px); height: {data.size}px;">
    {#each data.windows as window}
        <Window id={window}></Window>
    {/each}
</div>

<style lang="scss">
    div {
        position: absolute;
        margin: 10px;
        width: calc(100% - 20px);
        bottom: 0;
    }
</style>