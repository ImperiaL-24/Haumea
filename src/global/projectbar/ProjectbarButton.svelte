<script lang="ts">
    import { fade } from "svelte/transition";



    export let selected: boolean = false;
    export let title: string;
    export let icon: string;
    export let closeAction: Function = () => {};
    export let isSaved: boolean = false;
    let isOver = false;
    
</script>

<div class="button-space" >
    <div class="actual-button" on:mouseenter={() => isOver = true} on:mouseleave={() => isOver = false}>
        <img class="icon" src={icon} alt="project icon" class:selected={selected}/>
        <button class="main"  on:click|preventDefault><p class:selected={selected}>{title}</p></button>
        <div class="close-button">
            {#if isOver}
            <img  in:fade={{duration:200}} out:fade={{duration:200}} class="close" src="icons/cross.svg" on:mouseup={() => closeAction()} alt="close"/>
            {:else if !isSaved}
            <img  in:fade={{duration:200}} out:fade={{duration:200}} class="close" src="icons/circle.svg" alt="close"/>
            {:else}
            <img style="opacity: 0"  class="close" alt="close"/>
            {/if}
        </div>
    </div>
    <div class="highlight" class:is-over={isOver} class:highlight-selected={selected}></div>
</div>

<style lang="scss">
    .button-space {
        position: relative;
        height: 100%;
        width: fit-content;

        .actual-button {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100%;
            padding: 0px 20px;
        }
        .icon {
            position: relative;
            height: 100%;
            width: 1rem;
            filter: invert(100%) drop-shadow(0px 1px 6px rgba(0, 0, 0, 0.6));
            opacity: 0.5;
            z-index: 3;
        }

        .close-button {
            position: relative;
            width: 0.6rem;
            height: 0.6rem;
            filter: invert(100%) drop-shadow(0px 1px 6px rgba(0, 0, 0, 0.6));
            opacity: 0.5;
            transition: 0.2s opacity;
            z-index: 3;

            display: flex;
            align-items: center;
            img {
                position: absolute;
                width: 100%;
                height: 100%;
            }
        }

        .main {
            position: relative;
            border: none;
            background: none;
            outline: none;

            margin: 0;
            padding: 0;
            height: 100%;
            p {
                max-width: 150px;
                overflow: hidden; 
                margin: 0;
                color: rgba(231, 231, 231, 0.700);
                font-family: 'Poppins';
                font-size: 0.9em;
                text-shadow: 0px 1px 6px rgba(0, 0, 0, 0.6);
                text-overflow: ellipsis;
                white-space: nowrap;
                padding: 0px 5px;
            }


            transition: all 1s;
            z-index: 3;
        }

        div {
            color: rgba(231, 231, 231, 0.800);
        }

        .highlight {
            position: absolute;
            height: 150%;
            width: 200%;
            top:0;
            left: -50%;
            background: radial-gradient(ellipse at 50% -150%, rgb(214, 86, 93) 30%, rgba(0, 0, 0, 0) 70%);
            background-size: 100% 80%;
            background-repeat: no-repeat;
            opacity: 0.0;
            transition: all 0.2s;
            z-index: 2;
        }

        .is-over {
            opacity: 0.1;
        }
    }

    .highlight-selected {
        opacity: 0.4!important; 
    }

    .selected {
        color: rgba(255, 255, 255, 1)!important;
        opacity: 0.8!important;
    }

    .hide {
        opacity: 0!important;
    }
</style>