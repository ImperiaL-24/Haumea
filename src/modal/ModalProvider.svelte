<script lang="ts">
    import { Modal, activeModal } from "src/haumea/modal";
    import NewProjectModal from "./modals/NewProjectModal.svelte";
    import { fade } from "svelte/transition";


</script>
{#if $activeModal != null}
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div in:fade={{duration: 200}} out:fade={{duration: 200}}  class="bg" on:click|self={() => $activeModal = null}>
    {#if $activeModal == Modal.NEW_PROJECT}
        <NewProjectModal></NewProjectModal>
    {/if}
</div>
{/if}
<style lang="scss">
    .bg {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100vh;
        z-index: 10000;
        background-color:rgba(14, 14, 14, 0.336);
        backdrop-filter: blur(2px);

        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>