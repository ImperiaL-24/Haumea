<script lang="ts">
    export let label: string;
    export let number: boolean = false;
    export let value;
</script>
<div>
    <p>{label}</p>
    {#if number}
    <input type="number" bind:value={value}>
    {:else}
    <input type="text" bind:value={value}>
    {/if}
</div>


<style lang="scss">
    p {
        margin: 5px 0px;
        color: var(--lightest);
    }

    input {
        background: #00000048;
        border: none;
        border-radius: 5px;
        padding: 5px 15px;
        outline: none;
        color: var(--lightest);
        outline: var(--red) solid;
        outline-width: 0;
        transition: outline-width 0.1s;
        &:focus {
            outline-width: 2px;
        }
    }
</style>