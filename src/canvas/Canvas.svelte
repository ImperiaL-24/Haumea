<script lang="ts">
    import { getClickLocation } from "../util";
    import { currentTool } from "../engine/tool/ToolManager";
    import { canvasBase, canvasShadow, getCanvasPosition, setCanvasPosition, transition } from "../haumea/preview";
    import { innerRect } from "../store";
    import Cursor from "./Cursor.svelte";
    import { App, CanvasProjectTab } from "haumea/tab";
    import type { PercentagePos } from "src/haumea/math";
    import type { Layer, CanvasState } from "src/haumea/canvas";
    import { currentWindowId } from "src/haumea/window";
    import CanvasPreview from "./CanvasPreview.svelte";
    import LayerPreview from "./LayerPreview.svelte";


    $$: App.activeTabChange => let activeCanvas: CanvasProjectTab = App.activeCanvas;
    $$: App.activeTabChange => let activeState: CanvasState = activeCanvas?.activeState;
    $$: App.activeTabChange => $transition = false;
    $$: App.activeTabChange => console.warn(activeState);


    $$: $: activeCanvas?.activeStateChange => activeState = activeCanvas?.activeState;
    $$: $: activeCanvas?.activeStateChange => console.log("ACTIVE STATE CHANGE");

    $$: $: activeCanvas?.zoomChange => let zoom = activeCanvas?.zoom;

    $$: $: activeCanvas?.positionChange => let position: PercentagePos = activeCanvas?.position;

    $$: $: activeState?.layersChange => let layers: Layer[] = activeState?.layers;
    let onWheel = (e) => {
        $transition = true;
        const mouseLocation = getClickLocation($canvasBase);
        const oldZoom = activeCanvas?.zoom;
        const newZoom = e.deltaY < 0 ? Math.min(1000, oldZoom *1.25) : Math.max(0.01, oldZoom /1.25);
        if(App.activeCanvas) App.activeCanvas.zoom = newZoom;
 
        setCanvasPosition(getCanvasPosition().add(mouseLocation.negate()).product(newZoom/oldZoom).add(mouseLocation).asPixelPos());

    }
    let isMouseOver: boolean = false;
</script>

<div 
on:mouseenter={() => $currentWindowId == "" ? isMouseOver=true : null}
on:mouseleave={() => $currentWindowId == "" ? isMouseOver=false : null}
on:mousemove={(e) => $currentWindowId == "" ? $currentTool.onmousemove(e) : null}
on:mousedown={(e) => $currentWindowId == "" ? $currentTool.onmousedown(e) : null}
on:mouseup={(e) => $currentWindowId == "" ? $currentTool.onmouseup(e) : null}
on:keydown={(e) => $currentWindowId == "" ? $currentTool.onkeydown(e) : null}
bind:this={$canvasBase} style="width:calc(100% - {$innerRect.width}px); margin-left:{$innerRect.x}px; height:calc(100vh - {$innerRect.height}px)" 
on:wheel|passive={(e) => onWheel(e)}
class:no-cursor={$currentWindowId == ""}>

    <div class="shadow"
    bind:this={$canvasShadow}
    style="top: {position.y}%; left: {position.x}%; width: {activeState?.dimension.x*zoom}px; height: {activeState?.dimension.y*zoom}px; {$transition ? `transition: 0.2s all!important;`: ``}">

        {#each layers as layer}
            <LayerPreview bind:layer={layer}></LayerPreview>
        {/each}
        <div class="true-shadow"></div>
    </div>
    
</div>
{#if isMouseOver}
    <Cursor></Cursor>
{/if}




<style lang="scss">
    div {
        position: relative;
        height: 100vh;
        width: 100%;
        z-index: 0;
        .shadow {
            position: absolute;
            transition: 0.2s width, 0.2s height;   
            image-rendering: pixelated;
            translate: -50% -50%;
            z-index: 1;
        }

        .true-shadow {
            width: 100%;
            height: 100%;
            position: absolute;
            top: 0;
            left: 0;
            box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
            z-index: -1;
        }

    }
    .no-cursor {
        cursor: none;
    }
</style>