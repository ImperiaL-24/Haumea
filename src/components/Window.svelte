<script lang="ts">

import { indexCount } from "../store";
export let title: string;
export let x: string;
export let y: string;
let window: HTMLDivElement;
let moving: boolean = false;
let move = (e:MouseEvent) => {
    if(!moving) return;
    console.log(e.movementX)
    x=(parseInt(x)+e.movementX).toString()
    y=(parseInt(y)+e.movementY).toString()
}
</script>

<div bind:this={window} style="top: {y}px; left: {x}px;" on:mousedown={() => {window.style.zIndex=($indexCount+1).toString(); $indexCount++;}}>
 <nav on:mousedown={() => {moving = true}}>
    <p>{title}</p>
 </nav>
 <slot/>
</div>
<svelte:window on:mousemove={(e) => move(e)} on:mouseup={() => {moving = false;}}></svelte:window>

<style lang="scss">
    div {
        position: fixed;
        height: 400px;
        width: 300px;
        background-color: rgba($color: #252525, $alpha: 0.6);
        backdrop-filter: blur(12px);
        box-shadow: 0px 0px 5px #000;
        border-radius: 10px;
    }
nav {
    user-select: none;
    width: 100%;
    height: 20px;
    background-color: rgba($color: #141414, $alpha: 0.8);
    p {
        margin: 0;
    }
}
</style>