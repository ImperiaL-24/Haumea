<script lang="ts">
    import { Layer as LayerData } from "src/haumea/canvas";
    import { App } from "src/haumea/tab";
    import Layer from "./Layer.svelte"

    $$: App.activeTabChange => let activeCanvas = App.activeCanvas;
    
    $$: $: activeCanvas?.activeStateChange => let activeState = activeCanvas.activeState;

    $$: $: activeState?.layersChange => let layers = activeState?.layers;

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
        <img src="icons/add-document.svg" on:click={() => App.activeCanvas.addState().addLayer(new LayerData(new ImageData(100,100), true))}/>
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