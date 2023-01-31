<script lang="ts">
    import ProjectbarButton from "./ProjectbarButton.svelte";

</script>


<div>
    <ProjectbarButton title="test.png" icon="icons/picture.svg"/>
    <ProjectbarButton title="bruh_memento_numero_dos.png" selected icon="icons/picture.svg" isSaved/>
</div>

<style lang="scss">
    div {
        position: absolute;
		height: 28px;
        top: 28px;
        height: 28px;
        width: 100%;
        background-color: none;
        backdrop-filter: blur(3px);
        border-bottom-left-radius: 5px;
        border-bottom-right-radius: 5px;
        z-index: 9999;
        overflow: hidden;

        display: flex;

        &::before {
            position: absolute;
            content: "";
            height: 56px;
            background-color: rgba(18, 18, 19, 0.6);
            width: 100%;
            top: -28px;
            border-radius: 5px;
        }
    }
</style>