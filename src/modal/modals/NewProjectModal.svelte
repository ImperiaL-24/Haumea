<script>
    import Input from "../Input.svelte";
    import { App, CanvasProjectTab } from "../../haumea/tab";
    import { CanvasState } from "src/haumea/canvas";
    import { activeModal } from "src/haumea/modal";
    let name;
    let height;
    let width;
    let createProject = () => {
        let tab = new CanvasProjectTab();
        let data = new ImageData(width, height)
        tab.setState(new CanvasState(tab,data));
        tab.tabName = name;
        App.openTab(tab);
        $activeModal = null;
    }
</script>
<div class="modal">
    <div class="bar"></div>
    <h1>Create New Project</h1>
    <div class="main">
        <Input label="Project Name" bind:value={name}/>
        <Input label="Height" bind:value={height}/>
        <Input label="Width" bind:value={width}/>
        <button on:click={() => createProject()}>Create</button>
    </div>
    
</div>

<style lang="scss">
.modal {
    background-color: rgba(30, 33, 37, 0.800);
    backdrop-filter: blur(12px);
    box-shadow: 0px 0px 5px #000;
    border-radius: 5px;
    z-index: 5;
    height: 80%;
    width: 400px;

    display: flex;
    flex-direction: column;
    align-items: center;

    color: rgba(203, 203, 203, 0.789);
    .bar {
        width: 100%;
        height: 15px;
        background-color: none;
        pointer-events: none;
        background-color: rgba($color: #111213, $alpha: 0.6);
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;
    }

    .content {
        width: 100%;
        height: calc(100% - 45px);
    }
    .main {
        padding: 15px 0px 40px 0px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 10px;
        height: 100%;
    }

    transition: opacity 0.2s, outline-width 0.1s;

    button {
        margin-top: 40px;
        outline: none;
        border: none;
        border-radius: 5px;
        background-color: var(--red);
        padding: 10px 40px;
        color: white;
        font-family: 'Poppins';
        font-size: 1.1em;
    }
}
</style>