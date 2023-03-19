<script lang="ts">
    import Window from "./window/Window.svelte";
    import { innerRect, isWindowFocused, ClickState, clickState, ModifierState, modifierState } from './store'; 
    import {TabType, WindowBuilder, windows, currentWindowId, addWindow} from 'haumea/window'
    import Navbar from "./global/Navbar.svelte";
    import Canvas from "./canvas/Canvas.svelte";
    import { processKey } from "haumea/keybind";
    import Anchor from "./window/anchor/Anchor.svelte";
    import { onMount } from "svelte";
    import { Vector2 } from "haumea/math";
    import { appWindow } from '@tauri-apps/api/window'
    import AnchorLeft from "./window/anchor/AnchorLeft.svelte";
    import AnchorBottom from "./window/anchor/AnchorBottom.svelte";
    import AnchorRight from "./window/anchor/AnchorRight.svelte";
    import Projectbar from "./global/projectbar/Projectbar.svelte";
    import { App, ProjectTab, ProjectTabType } from "haumea/tab";
    import {anchors} from "haumea/anchor"
    import Home from "./home/Home.svelte";
    
    // TODO: DEPRECATE REACTIVE;
    $$: App.activeTabChange => let activeTab: ProjectTab = App.activeTab;
    
    let mouseMove = (e) => {
        let state = ClickState.from($clickState);
        state.target = e.target;
        state.delta = new Vector2(e.movementX, e.movementY);
        state.position = new Vector2(e.clientX, e.clientY);
        if(state.leftClick) state.leftClickDelta = state.leftClickDelta.add(state.delta);
        if(state.rightClick) state.rightClickDelta = state.rightClickDelta.add(state.delta);
        $clickState = state;
    }
    let mouseDown = (e) => {
        let state = ClickState.from($clickState);
        state.target = e.target;
        state.leftClick = e.buttons%2==1;
        state.rightClick = e.buttons>>1%2==1;
        state.leftClickDelta = new Vector2();
        state.rightClickDelta = new Vector2();
        $clickState = state;
    }
    let mouseUp = (e) => {
        let state = ClickState.from($clickState);
        state.target = e.target;
        state.leftClick = e.buttons%2==1;
        state.rightClick = e.buttons>>1%2==1;
        state.leftClickDelta = new Vector2();
        state.rightClickDelta = new Vector2();
        $clickState = state;
    }
    let keyModifier = (e) => {
        let state = new ModifierState();
        state.altKey = e.altKey;
        state.ctrlKey = e.ctrlKey;
        state.shiftKey = e.shiftKey;
        $modifierState = state;
    }
    if(App.activeTab == undefined) {
        App.openTab(new ProjectTab(ProjectTabType.HOME, "Home"));
    }
    
    onMount(async () => {
        
        addWindow(new WindowBuilder(TabType.ColorSelector,TabType.Test, TabType.Layers).tabbed(true).build());
        addWindow(new WindowBuilder(TabType.Toolbar).resizeable(false).size(40, 295).build());
        const unlisten = await appWindow.onFocusChanged(({ payload: isFocused }) => {
            $isWindowFocused = isFocused;
            $modifierState = new ModifierState();
            $clickState = new ClickState();
        });
        return () => unlisten();
    })

    $: {
        $anchors;
        let rect= {x:0,y:0,height:0,width:0};

        for(let [_id, anchor] of $anchors) {
            if(!anchor.resizeable) continue;
            if(anchor.position=="left") {
                rect.width+=anchor.size;
                rect.x+=anchor.size;
            }
            if(anchor.position=="right") {
                rect.width+=anchor.size;
            }
            if(anchor.position=="bottom") {
                rect.height+=anchor.size;
            }
        }
        $innerRect = rect;
    }
</script>
<div class="top">
    <Navbar />
    <Projectbar/>
</div>
<div class="test">
    {#if activeTab && activeTab.type == ProjectTabType.IMAGE}
    {#key $windows || $anchors}
            {#each [...$windows] as window}
                {#if !window[1].anchored}
                    <Window id={window[0]}></Window>
                {/if}
            {/each}
    {/key}
        <Canvas></Canvas>
        <Anchor></Anchor>
        <Anchor position="left"></Anchor>
        <Anchor position="bottom"></Anchor>
        {#each [...$anchors] as [id, anchor]}
            {#if anchor.position == "bottom"}
                <AnchorBottom id={id}/>
            {:else if anchor.position == "left"}
                <AnchorLeft id={id}/>
            {:else}
                <AnchorRight id={id}/>
            {/if}
            {/each}
    {:else if activeTab && activeTab.type == ProjectTabType.HOME}
        <Home/>
    {:else if activeTab && activeTab.type == ProjectTabType.SETTINGS}
        <p>Setting</p>
    {/if}
</div>

<svelte:window 
on:mousemove={(e) => { mouseMove(e)}} 
on:mouseup={(e) => {$currentWindowId=""; mouseUp(e)}} 
on:mousedown={(e) => {mouseDown(e)}}  
on:keydown|preventDefault={(e) => {keyModifier(e); processKey(e);}}
on:keyup|preventDefault={(e) => keyModifier(e)}/>

<style lang="scss">
    .top {
        position: absolute;
        width: calc(100% - 10px);
        height: fit-content;
        top: 5px;
        left: 5px;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
    }
    .test {
        position: relative;
        height: calc(100vh - 60px);
        margin-top: 60px;
    }
</style>
