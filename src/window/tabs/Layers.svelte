<script lang="ts">
    import { currentTab } from "src/haumea/tab";

    let layers: ImageData[]
    $: $currentTab.canvasData?.get().layers.$.subscribe(n => layers = n);
    console.log($currentTab.canvasData.get());


</script>

<main>

</main>
{#each layers as layer}
    <p>hi</p>
{/each}

<style lang="scss">

</style>