<script lang="ts">
    import { windows } from "../store";
    import type { TabType } from "./TabType";

    export let index: number;
    export let id: string;
    export let tab: TabType;

    let isOver = false;
    let highlight: HTMLDivElement;
    $: {
        if(highlight) {
            if(index==$windows.get(id).selectedTab) {
            highlight.style.opacity = "0.5"
            } else {
                highlight.style.opacity = "0.0"
            }
        }

    }

let data = $windows.get(id);
</script>

<div class="button-space" >
    <button on:mouseenter={() => isOver = true} on:mouseleave={() => isOver = false} on:click={() => {$windows.get(id).selectedTab = index;}} class:selected={index==$windows.get(id).selectedTab}>{tab.title}</button>
    <div bind:this={highlight} class="highlight" class:is-over={isOver} class:highlight-selected={index==$windows.get(id).selectedTab}></div>
</div>

<style lang="scss">
    .button-space {
        position: relative;
        height: 100%;
        button {
            position: relative;
            border: none;
            color: var(--lightest);
            font-family: 'Poppins';
            font-size: 16px;
            margin: 0;
            padding: 0px 20px;
            height: 100%;
            text-align: center;
            background: none;
            transition: all 0.2s;
            z-index: 3;
        }

        .highlight {
            position: absolute;
            height: 100%;
            width: 200%;
            top:0;
            left: -50%;
            top: 0;
            background: radial-gradient(ellipse at 50% -200%, rgb(214, 86, 93) 40%, rgba(217,38,38,0) 70%);
            background-size: 100% 80%;
            background-repeat: no-repeat;
            mix-blend-mode: color-dodge;
            opacity: 0.0;
            transition: all 0.2s;
            z-index: 2;
        }

        .is-over {
            opacity: 0.1;
        }
    }

    .selected {
        color: var(--lighter);
    }

    .highlight-selected {
        opacity: 0.5; 
    }

</style>