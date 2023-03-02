<script lang="ts">
    import { getClickLocation } from "../util";
    import { currentTool } from "../engine/tool/ToolManager";
    import { canvasBase, getCanvasPosition, setCanvasPosition, transition } from "../haumea/preview";
    import { innerRect } from "../store";
    import Cursor from "./Cursor.svelte";
    import { App, CanvasProjectTab } from "haumea/tab";
    import type { PercentagePos } from "src/haumea/math";
    import type { Layer, CanvasState } from "src/haumea/canvas";
    import CanvasLayer from "./CanvasLayer.svelte";
    import { currentWindowId } from "src/haumea/window";

    let activeState:CanvasState;

    let activeCanvas: CanvasProjectTab;
    App.activeTabChange.subscribe(() => {
        activeCanvas = App.activeCanvas;
        $transition = false;
        console.log(activeCanvas);
    });
    
    $: activeCanvas.data.activeStateChange.subscribe(() => activeState = activeCanvas.data.activeState);

    let zoom: number;
    $: activeCanvas.data.zoomChange.subscribe(() => zoom = activeCanvas.data.zoom);

    let position: PercentagePos;
    $: activeCanvas.data.positionChange.subscribe(() => position = activeCanvas.data.position);

    let layers: Layer[] = [];
    $: activeState.layers.$.subscribe(n => layers = n);

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

    {#each layers as layer, i}
        <CanvasLayer bind:pos={position} bind:zoom={zoom} bind:currentState={activeState} layer={layer} index={i}></CanvasLayer>
    {/each}

    <div class="shadow"

    style="top: {position.y}%; left: {position.x}%; scale: {zoom}; width: {activeState?.dimension.value.x}px; height: {activeState?.dimension.value.y}px; {$transition ? `transition: 0.2s all!important;`: console.log($transition)}">
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
</style>