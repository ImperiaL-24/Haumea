<script lang="ts">

    export let selected: boolean;
    export let title: string;
    let isOver = false;
    
</script>

<div class="button-space">
    <button on:mouseenter={() => isOver = true} on:mouseleave={() => isOver = false} on:click|preventDefault class:selected={selected}>{title}</button>
    <div class="highlight" class:is-over={isOver} class:highlight-selected={selected}></div>
</div>

<style lang="scss">
    .button-space {
        position: relative;
        height: 100%;
        width: fit-content;
        button {
            position: relative;
            border: none;
            color: var(--lighter);
            font-family: 'Poppins';
            font-size: 0.90em;
            margin: 0;
            padding: 0px 20px;
            height: 100%;
            text-align: center;
            background: none;
            transition: all 1s;
            z-index: 3;
            outline: none;
        }

        .highlight {
            position: absolute;
            height: 100%;
            width: 200%;
            top:0;
            left: -50%;
            background: radial-gradient(ellipse at 50% -200%, rgb(214, 86, 93) 20%, rgba(217,38,38,0) 70%);
            background-size: 100% 80%;
            background-repeat: no-repeat;
            opacity: 0.0;
            transition: all 0.2s;
            z-index: 2;
        }

        .is-over {
            opacity: 0.2;
        }
    }

    .highlight-selected {
        opacity: 0.4!important; 
    }

    .selected {
        color: var(--lightest)!important;
    }


</style>