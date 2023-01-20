<script lang="ts">
    import { currentWindow, windows, windowRerender } from "../../store";

    let hovered: boolean;
    let hoveredWindowId: string;
let windowEnter = () => {
    if($currentWindow=="") return;
    console.log($windows.get($currentWindow))
    hovered = true;
    hoveredWindowId = $currentWindow;
}

let windowLeave = () => {
    if($currentWindow=="") return;
    console.log($windows.get($currentWindow))
    hovered = false;
    hoveredWindowId = "";
}

let windowDrop = () => {
    console.log("mdown!", hoveredWindowId)
    if(hoveredWindowId=="") return;
    hovered = false;
    $windows.delete(hoveredWindowId)
    console.log("anchored!")
    $windowRerender = !$windowRerender;
}

</script>


<div class:hovered={hovered} class="anchor-drop" on:mouseenter={(e) => windowEnter()} on:mouseleave={(e) => windowLeave()}></div>

<svelte:window  on:mouseup={() => { windowDrop()}}></svelte:window>

<style lang="scss">
    .anchor-drop {
        position: absolute;
        width: 150px;
        height: calc(100% - 20px);
        right: 0;
        top:0;
        background: none;
        margin: 10px;
        transition: all 0.2s;
        border-radius: 5px;
    }

    .hovered {
        background-color: var(--red);
    }
</style>