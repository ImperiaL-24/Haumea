<script lang="ts">
    import { fade, fly } from "svelte/transition";
    import { activeDropdown, navbarPressed } from "../store";


    export let text: string;
    let button: HTMLElement;
    $: console.log($navbarPressed, $activeDropdown);
</script>
<div>
    <button 
    bind:this={button} 
    on:click={() => {$navbarPressed = true; $activeDropdown=text;}} 
    on:mouseenter={() => {if($navbarPressed) $activeDropdown = text;}}
    >{text}</button>
    {#if $activeDropdown == text}
        <div class="content" in:fly="{{ y: -10, duration: 400 }}" out:fade={{duration:100}}>
            <slot/>
        </div>
    {/if}
</div>



<style lang="scss">
    div {
        position: relative;
        height: 100%;
        display: flex;
        align-items: center;
    }
    button {
        border: none;
        outline: none;
        background: none;
        font-size: 0.85rem;
        color: rgba(255, 255, 255, 0.619);
        font-family: 'Poppins';
        font-weight: 400;
        height: calc(100% - 8px);
        border-radius: 4px;
        line-height: 1.1;
        transition: 0.2s all;
        padding: 0px 8px;
        &:hover {
            background-color: rgba(255, 255, 255, 0.09);
        }
    }

    .content {
        position: absolute;
        background-color: rgba(30, 33, 37, 0.800);
        backdrop-filter: blur(12px);
        border-radius: 5px;
        width: fit-content;
        min-width: 200px;
        top: calc(100% + 4px);
        padding: 5px;
        box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
        display: flex;
        flex-direction: column;
        height: fit-content;
        gap:4px;
    }
</style>