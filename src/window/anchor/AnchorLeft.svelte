<script lang="ts">
    import { clamp } from "src/util";
    import { clickState } from "src/store";
    import Window from "../Window.svelte";
    import {anchors, Anchor} from "haumea/anchor"
    export let id: string;

    let data: Anchor = $anchors.get(id);
    let resizing = false;
    let initSize: number;
    let resize = () => {
        if(!resizing) return;
        console.log($clickState);
        data.size = clamp(initSize+$clickState.leftClickDelta.x,240,1200);
    }
</script>

<div style="width: {data.size}px;">
    {#each data.windows as window}
        <Window id={window}></Window>
    {/each}
    <div class="resize" class:resize-hover={resizing} on:mousedown={() => {initSize = data.size; resizing = true}}/>
</div>

<svelte:window on:mousemove={() => {resize()}} on:mouseup={() => resizing=false}></svelte:window>

<style lang="scss">
    .resize {
        position: absolute;
        background-color: #00000000;
        border-radius: 2px;
        transition: 0.2s background-color;
        height: 100%;
        width: 4px;
        cursor:w-resize;
        top:0;
        left:100%;
        margin: 0;
    }
    .resize-hover {
        background: var(--red);
    }
    div {
        position: absolute;
        height: calc(100% - 20px);
        margin: 10px;
        top: 0;
        left: 0;
    }
</style>