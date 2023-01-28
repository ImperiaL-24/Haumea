<script lang="ts">
    import { activeDropdown, navbarPressed } from "../store";


    export let text: string;
    let button: HTMLElement;
    $: console.log($navbarPressed, $activeDropdown);
</script>

<button 
bind:this={button} 
on:click={() => {$navbarPressed = true; $activeDropdown=text;}} 
on:mouseenter={() => {if($navbarPressed) $activeDropdown = text;}}
>{text}</button>
{#if $activeDropdown == text}
    <slot/>
{/if}


<style lang="scss">
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
</style>