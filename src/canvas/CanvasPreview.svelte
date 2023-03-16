<script lang="ts">
    import type { Layer } from "src/haumea/canvas";

    export let layer: Layer;
    let canvasPreview: HTMLCanvasElement;

    let updateCanvas = () => {
        if(!canvasPreview) return;
        const data: ImageData = layer.getImageData();
        canvasPreview.width = data.width;
        canvasPreview.height = data.height;
        const ctx = canvasPreview.getContext("2d");
        ctx.putImageData(data,0,0);
    }
        
    $$: $: layer.layerChange => updateCanvas();

</script>

<canvas bind:this={canvasPreview}></canvas>

<style lang="scss">
    canvas {
        width: 100%;
        height: 100%;
        z-index: -1;
    }
</style>