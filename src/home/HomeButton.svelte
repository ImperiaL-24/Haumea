<script lang="ts">
    import type { Action } from "src/haumea/keybind";


    export let action: Action;
    export let main: boolean = false;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<main on:click={() => {action.run()}} class:main={main}>
    <div class="body">
        {#if action.icon!= ""}
            <img src={action.icon} alt="icon"/>
        {/if}
        <div >{action.name}</div>
    </div>
</main>

<style lang="scss">
main {
    width: calc(100% - 20px);
    max-width: 400px;
    display: flex;
    justify-content: space-between;
    gap: 10px;
    align-items: center;
    color: white;
    padding: 1em 1em;
    font-size: 1rem;
    border-radius: 4px;
    line-height: 1;
    height: 1.4em;
    transition: 0.2s all;
    &:hover:not(.main) {
        background-color: rgba(255, 255, 255, 0.09);
    }
    img {
        height: 1.2em;
        width: 1.2em;
        filter: invert(100%);
    }
    .body {
        display: flex;
        align-items: center;
        gap: 6px;
    }
}

.main {
    background-color: var(--red);
}
</style>