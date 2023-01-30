<script lang="ts">
    import WindowButton from "../../window/WindowButton.svelte";

</script>


<div>
    <WindowButton title="testtesttesttest.png" selected={true}/>
</div>

<style lang="scss">
    div {
        position: absolute;
		height: 28px;
        top: 32px;
        height: 28px;
        width: 100%;
        background-color: rgba(39, 44, 48, 0.8);
        backdrop-filter: blur(12px);
        border-radius: 5px;
        z-index: 10000;
    }
</style>