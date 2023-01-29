<script lang="ts">
    import { appWindow } from '@tauri-apps/api/window'
    import { activeDropdown, isWindowFocused, navbarPressed } from '../store';
    import { MinusIcon, SquareIcon, XIcon } from "svelte-feather-icons";
    import NavbarCategory from './NavbarCategory.svelte';
    import { fade } from 'svelte/transition';
    import NavbarButton from './NavbarButton.svelte';
    import NavbarSeparator from './NavbarSeparator.svelte';
    import { currentState, redo, stateList, undo } from '../engine/canvas/UndoManager';
</script>

<div class="nav"  class:focused={$isWindowFocused}>
    <div data-tauri-drag-region class="blur"/>
    <div class="left">
        <img src="icon.png" alt="icon">
        <NavbarCategory text="File"><p>hi</p></NavbarCategory>
        <NavbarCategory text="Edit">
            <NavbarButton name="Undo" keybind="Ctrl+Z" icon="icons/rotate-left.svg" disabled={$currentState == -50 || $stateList.length == -$currentState} action={() => undo()}/>
            <NavbarButton name="Redo" keybind="Ctrl+Shift+Z" icon="icons/rotate-right.svg" disabled={$currentState == -1} action={() => redo()}/>
            <NavbarSeparator/>
            <NavbarButton name="Refresh (DEV)" keybind="Ctrl+R" icon="icons/refresh.svg" action={() =>  location.reload()}/>

        </NavbarCategory>
        <NavbarCategory text="Select"><p>hi3</p></NavbarCategory>
        <NavbarCategory text="Layer"><p>hi4</p></NavbarCategory>
        <NavbarCategory text="Window"><p>hi5</p></NavbarCategory>
    </div>
    
    <div class="right">
        <button on:click|preventDefault={() => appWindow.minimize()}><MinusIcon size="1.2x"/></button>
        <button on:click|preventDefault={() => appWindow.toggleMaximize()}><SquareIcon size="1.1x"/></button>
        <button class="red-hover" on:click|preventDefault={() => appWindow.close()}><XIcon size="1.5x"/></button>
    </div>
    
</div>

{#if $navbarPressed}
<div in:fade={{duration:100}} out:fade={{duration:100}} class="navbar-cover" on:mouseup={() => {$navbarPressed = false; $activeDropdown="";}}></div>
{/if}
<!-- <svelte:window on:click={(e) => { if(e.target.parentNode != buttonContainer) {$navbarPressed = false; $activeDropdown="";}}}></svelte:window> -->
<style lang="scss">
	.nav {
        position: absolute;
		background-color: var(--nav-unfocused);
        // backdrop-filter: blur(12px);
		height: 28px;
        top: 5px;
        left: 5px;
        width: calc(100% - 10px);
        display: flex;
        justify-content: space-between;

        transition: 0.3s all;
        border-radius: 5px;
        
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
            z-index: 24;
            backdrop-filter: blur(1px);
    }
</style>

