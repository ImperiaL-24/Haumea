<script lang="ts">
    import { currentTab } from "src/haumea/tab";
    import type { Reactive } from "src/util";
    import Layer from "./Layer.svelte";
    let layers: ImageData[]
    $: $currentTab.canvasData?.get().layers.$.subscribe(n => layers = n);
    console.log($currentTab.canvasData.get());

    let activeLayer: Reactive<number>
    $: activeLayer = $currentTab.canvasData?.get().activeLayer
</script>

<main>
    {#each layers as layer, i}
        <Layer index={i} data={layer}/>
    {/each}
</main>


<style lang="scss">
    main {
        display: flex;
        flex-direction: column;
        height:calc(100% - 20px);
        gap: 10px;
        padding: 10px;
        user-select: none;
    }
</style>