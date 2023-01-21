<script lang="ts">
    import { anchors, innerRect } from "../../store";
    import Window from "../Window.svelte";
    import type Anchor from "./Anchor";
    export let id: string;

    let data: Anchor = $anchors.get(id);

</script>

<div style="{data.position=="bottom" ? `width:calc(100% - ${$innerRect.width+30}px); height` : "width"}: {data.size}px;" class={data.position}>
    {#each data.windows as window}
        <Window id={window}></Window>
    {/each}
</div>

<style lang="scss">
    div {
        position: absolute;
        height: calc(100% - 20px);
        margin: 10px;
    }

    .right {
        top: 0;
        right: 0;
    }

    .left {
        top: 0;
        left: 0;
    }

    .bottom {
        width: calc(100% - 20px);
        bottom: 0;
    }
</style>