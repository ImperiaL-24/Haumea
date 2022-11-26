<script lang="ts">
    import Window from "./window/Window.svelte";
    import { mousePos, mouseDelta } from './store'; 
    import Toolbar from "./global/Toolbar.svelte";
    import { TabType } from "./window/TabType"
    
    let setMousePos = (e) => {
        $mouseDelta = [e.clientX-$mousePos[0], e.clientY-$mousePos[1]]
        $mousePos = [e.clientX, e.clientY];
    }


    let windows = [
        [TabType.ColorSelector, TabType.Test],
        [TabType.Test] 
    ]
</script>

<Toolbar />

{#each windows as window}
    <Window x=10 y=20 tabData={window}></Window>
{/each}

<svelte:window on:mousemove={(e) => setMousePos(e)}></svelte:window>
