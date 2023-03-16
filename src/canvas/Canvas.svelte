<script lang="ts">
    import { getClickLocation } from "../util";
    import { currentTool } from "../engine/tool/ToolManager";
    import { canvasBase, canvasShadow, getCanvasPosition, setCanvasPosition, transition } from "../haumea/preview";
    import { innerRect } from "../store";
    import Cursor from "./Cursor.svelte";
    import { App, CanvasProjectTab } from "haumea/tab";
    import type { PercentagePos } from "src/haumea/math";
    import type { Layer, CanvasState } from "src/haumea/canvas";
    import CanvasLayer from "./CanvasLayer.svelte";
    import { currentWindowId } from "src/haumea/window";
    import CanvasPreview from "./CanvasPreview.svelte";

    let activeState:CanvasState;

    $$: App.activeTabChange => let activeCanvas: CanvasProjectTab = App.activeCanvas;
    $$: App.activeTabChange => console.warn("NEW TAB CHANGE");
    $: App.activeTabChange.subscribe(() => {
        activeState = activeCanvas?.data.activeState;
        $transition = false;
        console.warn("OLD TAB CHANGE");
    });
    
    $: activeCanvas?.data.activeStateChange.subscribe(() => {activeState = activeCanvas.data.activeState; console.log("ACTIVE STATE CHANGE");});

    let zoom: number;
    $: activeCanvas?.data.zoomChange.subscribe(() => zoom = activeCanvas.data.zoom);
    
    let position: PercentagePos;
    $: activeCanvas?.data.positionChange.subscribe(() => position = activeCanvas.data.position);

    let layers: Layer[] = [];
    $: activeState?.layers.$.subscribe(n => layers = n);

    let onWheel = (e) => {
        
        $transition = true;
        console.log($transition);
        const mouseLocation = getClickLocation($canvasBase);
        const oldZoom = activeCanvas?.data.zoom;
        const newZoom = e.deltaY < 0 ? Math.min(1000, oldZoom *1.25) : Math.max(0.01, oldZoom /1.25);
        App.activeCanvas.data.zoom = newZoom;
 
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
    style="top: {position.y}%; left: {position.x}%; scale: {zoom}; width: {activeState?.dimension.value.x}px; height: {activeState?.dimension.value.y}px; {$transition ? `transition: 0.2s all!important;`: ``}">

        {#each layers as layer}
            <div class="canvas">
                <CanvasPreview bind:layer={layer}></CanvasPreview>
            </div>
        {/each}

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
        canvas, .shadow {
            position: absolute;
            transition: 0.2s width, 0.2s height;   
            image-rendering: pixelated;
            translate: -50% -50%;
            z-index: 1;
        }

        .shadow {
            box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
        }

    }
    .no-cursor {
        cursor: none;
    }
    .canvas {
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        position: absolute;
    }
</style>