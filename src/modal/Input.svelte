<script lang="ts">
    export let label: string;
</script>

<p>{label}</p>
<input type="text">

<style lang="scss">
    p {
        margin: 5px;
        color: var(--lightest);
    }

    input {
        background: #00000080;
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