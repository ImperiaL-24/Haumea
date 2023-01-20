<script lang="ts">
    import { clamp } from "../util";
    import { mouseClickDelta } from "../store";

    import type Window from "./Window";

    export let data: Window;
    let initWidth = 0;
let initHeight = 0;
let initX = 0;
let initY = 0;
    let resize = () => {
    if(data.resizing=="none") return;

    if(data.resizing.includes("e")) {
        data.width = clamp(initWidth+$mouseClickDelta[0],240,1200);
    }
    if(data.resizing.includes("w")) {
        data.width = clamp(initWidth-$mouseClickDelta[0],240,1200);
        if(data.width<1200 && data.width>240)
        data.x = initX + $mouseClickDelta[0];
    }
    if(data.resizing.includes("n")) {
        data.height = clamp(initHeight-$mouseClickDelta[1],240,1200);
        if(data.height<1200 && data.height>240)
        data.y = initY + $mouseClickDelta[1];
    }
    if(data.resizing.includes("s")) {
        data.height = clamp(initHeight+$mouseClickDelta[1],240,1200);
    }
}

let resetPosCache = () => {
    initHeight = data.height;
    initWidth = data.width;
    initX = data.x;
    initY = data.y;
}
</script>

<div draggable="false" class="resize vertical left" class:resize-hover={data.resizing=="w"}  on:mousedown={() => {resetPosCache(); data.resizing = "w"}}></div>
<div draggable="false" class="resize vertical right" class:resize-hover={data.resizing=="e"} on:mousedown={() => {resetPosCache(); data.resizing = "e"}}></div>
<div draggable="false" class="resize horizontal top" class:resize-hover={data.resizing=="n"}  on:mousedown={() => {resetPosCache(); data.resizing = "n"}}></div>
<div draggable="false" class="resize horizontal bottom" class:resize-hover={data.resizing=="s"} on:mousedown={() => {resetPosCache(); data.resizing = "s"}}></div>

<div draggable="false" class="resize corner top left nw-cursor" class:resize-hover={data.resizing=="nw"} on:mousedown={() => {resetPosCache(); data.resizing = "nw"}}></div>
<div draggable="false" class="resize corner top right ne-cursor" class:resize-hover={data.resizing=="ne"} on:mousedown={() => {resetPosCache(); data.resizing = "ne"}}></div>
<div draggable="false" class="resize corner bottom left ne-cursor" class:resize-hover={data.resizing=="sw"} on:mousedown={() => {resetPosCache(); data.resizing = "sw"}}></div>
<div draggable="false" class="resize corner bottom right nw-cursor" class:resize-hover={data.resizing=="se"} on:mousedown={() => {resetPosCache(); data.resizing = "se"}}></div>

<svelte:window on:mousemove={() => {resize()}}></svelte:window>

<style lang="scss">

.nw-cursor {
    cursor:nw-resize;
}

.ne-cursor {
    cursor:ne-resize;
}


.corner {
    width: 8px;
    height: 8px;
}

.vertical {
    height: 100%;
    width: 4px;
    cursor:w-resize;
}

.horizontal {
    height: 4px;
    width: 100%;
    cursor:n-resize;
}

.resize {
    position: absolute;
    background-color: #00000000;
    border-radius: 2px;
    transition: 0.2s background-color;
}

.resize-hover {
    background: var(--red);
}

.left {
    left: -4px;
    top:0;
}
.right {
    right: -4px;
    top:0;
}
.top {
    top: -4px;
}
.bottom {
    bottom: -4px!important;
    top:unset;
}
</style>