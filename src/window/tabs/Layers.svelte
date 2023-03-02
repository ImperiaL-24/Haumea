<script lang="ts">
    import { CanvasState, Layer as LayerData } from "src/haumea/canvas";
    import { App, CanvasProjectTab } from "src/haumea/tab";
    import Layer from "./Layer.svelte"
    
    let activeState:CanvasState;

    let activeCanvas: CanvasProjectTab;
    $: App.activeTabChange.subscribe(() => activeCanvas = App.activeCanvas);
    
    $: activeCanvas.data.activeStateChange.subscribe(() => activeState = activeCanvas.data.activeState);

    let layers: LayerData[]
    $: activeState?.layers.$.subscribe(n => layers = n);

</script>

<main>
    <div class="layers">
        {#each layers as layer, i}
            <Layer bind:currentState={activeState} index={i} layer={layer}/>
        {/each}
    </div>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div class="buttons">
        <!-- svelte-ignore a11y-missing-attribute -->
        <img src="icons/add-document.svg" on:click={() => App.activeCanvas.data.addLayer(new LayerData(new ImageData(100,100)))}/>
    </div>
    
</main>


<style lang="scss">
    main {
        
        height:calc(100% - 20px);
        
        padding: 10px;
        user-select: none;

        
    }

    .layers {
        height:calc(100% - 40px);
        width: 100%;
        display: flex;
        flex-direction: column-reverse;
        justify-content: flex-start;
        align-items: center;
        overflow:overlay;
        z-index: 5;
    }
    
    .buttons {
        height: 30px;
        padding-top: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
        img {
            filter: invert(100%);
            opacity: 0.8;
            transition: all 0.2s;
            &:hover {
                filter: invert(100%) drop-shadow(0px 0px 4px hsla(353, 75%, 60%, 0.75));
                opacity: 1;
            }
            height: 70%;
        }
    }
</style>