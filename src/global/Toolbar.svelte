<script lang="ts">
    import { appWindow } from '@tauri-apps/api/window'
    import { onMount } from 'svelte';
    import { MinusIcon, SquareIcon, XIcon } from "svelte-feather-icons";

let focused = false;

onMount(async () => {
    const unlisten = await appWindow.onFocusChanged(({ payload: isFocused }) => {
        focused = isFocused;
    });
    return () => unlisten();
})

// #db8cbf #d92626

</script>

<nav data-tauri-drag-region class:focused>
    <div class="left">
        <img src="icon.png" alt="icon">
    </div>
    
    <div class="right">
        <button on:click|preventDefault={() => appWindow.minimize()}><MinusIcon size="1.2x"/></button>
        <button on:click|preventDefault={() => appWindow.toggleMaximize()}><SquareIcon size="1.1x"/></button>
        <button class="red-hover" on:click|preventDefault={() => appWindow.close()}><XIcon size="1.5x"/></button>
    </div>
</nav>

<style lang="scss">
	nav {
        position: absolute;
		background-color: var(--nav-unfocused);
        backdrop-filter: blur(12px);
		height: 28px;
        margin-top: 5px;
        margin-left: 5px;
        width: calc(100% - 10px);
        display: flex;
        justify-content: space-between;

        transition: 0.3s all;
        border-radius: 5px;
        
        user-select: none;
        z-index: 25;

        .left, .right {
            display: flex;
            align-items: center;
            height: 100%;
        }

        .left {
            padding: 0px 5px;
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
</style>

