<script lang="ts">
    import { appWindow } from '@tauri-apps/api/window'
    import { isWindowFocused, navbarPressed, unfocusNavbar } from 'src/store';
    import { MinusIcon, SquareIcon, XIcon } from "svelte-feather-icons";
    import NavbarCategory from './NavbarCategory.svelte';
    import { fade } from 'svelte/transition';
    import NavbarButton from './NavbarButton.svelte';
    import ActionNavbarButton from './ActionNavbarButton.svelte';
    import NavbarSeparator from './NavbarSeparator.svelte';
    import { ProjectTab, ProjectTabType, App } from 'haumea/tab';
    import { Action } from 'src/haumea/keybind';

    $$: App.activeTabChange => let activeCanvas = App.activeCanvas;
    $$: $: activeCanvas?.activeStateChange => let canUndo: boolean = activeCanvas?.canUndo;
    $$: $: activeCanvas?.activeStateChange => let canRedo = activeCanvas?.canRedo;

</script>

<div class="nav"  class:focused={$isWindowFocused}>
    <div data-tauri-drag-region class="blur"/>
    <div class="left">
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <img src="icon.png" alt="icon" on:click={() => {App.openTab(new ProjectTab(ProjectTabType.HOME, "Home")); unfocusNavbar()}}>
        <NavbarCategory text="File">            
            <ActionNavbarButton action={Action.NEW_TAB}/>
            <ActionNavbarButton action={Action.OPEN}/>
            <ActionNavbarButton disabled={!activeCanvas} action={Action.IMPORT}/>
            <NavbarSeparator/>
            <ActionNavbarButton disabled={!activeCanvas} action={Action.SAVE}/>
            <ActionNavbarButton disabled={!activeCanvas} action={Action.EXPORT}/>
            <NavbarSeparator/>
            <NavbarButton name="Settings" icon="icons/settings.svg" action={() =>  {App.openTab(new ProjectTab(ProjectTabType.SETTINGS, "Settings")); unfocusNavbar()}}/>
        </NavbarCategory>
        <NavbarCategory text="Edit">
            <ActionNavbarButton disabled={!canUndo} action={Action.UNDO}/>
            <ActionNavbarButton disabled={!canRedo} action={Action.REDO}/>
            <NavbarSeparator/>
            <ActionNavbarButton action={Action.RELOAD}/>
        </NavbarCategory>
        <NavbarCategory text="Select"><p>Select</p></NavbarCategory>
        <NavbarCategory text="Layer"><p>Layer</p></NavbarCategory>
        <NavbarCategory text="Window">
            <ActionNavbarButton disabled={!activeCanvas} action={Action.WINDOW_COLOR}/>
            <ActionNavbarButton disabled={!activeCanvas} action={Action.WINDOW_LAYER}/>
            <ActionNavbarButton disabled={!activeCanvas} action={Action.WINDOW_TOOLS}/>
        </NavbarCategory>
    </div>
    
    <div class="right">
        <button on:click|preventDefault={() => appWindow.minimize()}><MinusIcon size="1.2x"/></button>
        <button on:click|preventDefault={() => appWindow.toggleMaximize()}><SquareIcon size="1.1x"/></button>
        <button class="red-hover" on:click|preventDefault={() => appWindow.close()}><XIcon size="1.5x"/></button>
    </div>
    
</div>

{#if $navbarPressed}
<div in:fade={{duration:100}} out:fade={{duration:100}} class="navbar-cover" on:mouseup={() => unfocusNavbar()}></div>
{/if}
<style lang="scss">
	.nav {
        position: relative;
		background-color: var(--nav-unfocused);
        // backdrop-filter: blur(12px);
		height: 28px;
        width: 100%;
        display: flex;
        justify-content: space-between;

        transition: 0.3s all;
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;

        user-select: none;
        z-index: 100000;

        .blur {
            position: absolute;
            width: 100%;
            height: 100%;
            border-radius: 5px;
            backdrop-filter: blur(12px);
            z-index: -1;
        }

        .left, .right {
            display: flex;
            align-items: center;
            height: 100%;
            z-index: 100000;
        }

        .left {
            padding: 0px 5px;
            gap: 5px;
        }

        button {
            width: 45px;
            height: 100%;

            border: none;
            background: none;

            font-weight: 100;
            color: var(--white);

            transition: 0.2s all;
            &:hover {
                color: rgba($color: #ffffff, $alpha: 0.5);
            }
        }

        .red-hover:hover {
            color: rgba($color: #ff0000, $alpha: 0.7);
        }

        img {
            height: 22px;
        }

	}

    .focused {
        background-color: var(--nav-focused);
    }
    .navbar-cover {
            position: fixed;
            width: 100vw;
            top: 0;
            left: 0;
            background-color: rgba(0, 0, 0, 0.185);
            height: 100vh;
            z-index: 10000;
            backdrop-filter: blur(1px);
    }
</style>

