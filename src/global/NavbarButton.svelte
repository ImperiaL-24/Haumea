<script lang="ts">
    export let name:string;
    export let keybind:string = "";
    export let icon:string = "";
    export let disabled: boolean = false;
    export let action: Function = () => {};
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<main class:disabled={disabled} on:click={() => {if(!disabled) action()}}>
    <div class="body">
        {#if icon!= ""}
            <img src={icon} alt="icon"/>
        {/if}
        <div >{name}</div>
    </div>
    <div class="keybind">{keybind}</div>
</main>

<style lang="scss">
main {
    width: calc(100% - 20px);
    display: flex;
    justify-content: space-between;
    gap: 10px;
    align-items: center;
    color: var(--lightest);
    padding: 4px 10px;
    font-size: 0.85rem;
    border-radius: 4px;
    line-height: 1;
    height: 1.4em;
    transition: 0.2s all;
    &:hover:not(.disabled) {
        background-color: rgba(255, 255, 255, 0.09);
    }
    .keybind {
        opacity: 0.8;
    }
    img {
        height: 0.75rem;
        width: 0.75rem;
        filter: invert(48%) sepia(9%) saturate(438%) hue-rotate(147deg) brightness(99%) contrast(90%);
    }
    .body {
        display: flex;
        align-items: center;
        gap: 6px;
    }
}

.disabled {
    opacity: 0.5;
}
</style>