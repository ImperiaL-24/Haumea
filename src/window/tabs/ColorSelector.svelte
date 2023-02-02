<script lang="ts">
    import { Color } from "src/haumea/color";
    import { createEventDispatcher } from 'svelte';
    import { clamp, getMappedClickLocation } from "src/util";
    import { Vector2 } from "haumea/math";

    const dispatch = createEventDispatcher();

    let isClicked: boolean;
    let isHueClicked: boolean;

    let svSquare: HTMLElement;
    let huebar: HTMLImageElement;
    
    let pointer: HTMLDivElement;
    let huePointer: HTMLDivElement;

    export let colorTarget = [0,0,0];


    // Update the color selector when target color changes
    $: {
        if(svSquare!=null) {
            colorTarget[0];
            svSquare.style.background = `linear-gradient(360deg, rgba(0,0,0,1) 0%, rgba(255,0,0,0) 100%), linear-gradient(90deg, rgba(255,255,255,1) 0%, hsl(${colorTarget[0]},100%,50%) 100%)`
        }
        
    }

    // Change Pointer Locations
    $: {
        if(pointer) {
            pointer.style.top = `${(1-colorTarget[2])*100}%`;
            pointer.style.left = `${colorTarget[1]*100}%`;
        }
    }

    $: {
        if(huePointer) {
            huePointer.style.top = `${(1-colorTarget[0]/360)*100}%`;
        }
    }


    // Handle Clicks
    let handleClick = (e) => {
        let location = getMappedClickLocation(svSquare).clamp(new Vector2(),new Vector2(1,1));
        colorTarget = [colorTarget[0],location.x, 1-location.y]
        dispatch("colorchange", colorTarget)
    }
    let handleHueClick = (e) => {
        const hue = clamp((1-getMappedClickLocation(huebar).y),0,1)*360;
        colorTarget = [hue, colorTarget[1], colorTarget[2]]
        dispatch("colorchange", colorTarget)
        
    }
</script>

<main>
    <div class="info">
        <div class="color-preview" style:background-color={Color.newFromHSV(colorTarget[0], colorTarget[1], colorTarget[2]).asHex()}></div>
        <p>{Color.newFromHSV(colorTarget[0], colorTarget[1], colorTarget[2]).asHex()}</p>
    </div>

    <div class="color-sel">
        <div class="color-bg"
        bind:this={svSquare} 
        on:mousedown={(e) => {isClicked = true;handleClick(e)}}/>
        <div bind:this={pointer} class="pointer"></div>
    </div>

    <div class="selector">
        <div bind:this={huePointer} class="hue-pointer"></div>
        <img 
        bind:this={huebar}
        src="hue.png" 
        alt="color-picker" 
        draggable="false"
        on:mousedown={(e) => {isHueClicked = true; handleHueClick(e)}} 
        />
    </div>
</main>

<svelte:window on:mouseup={() => {isClicked=false; isHueClicked = false}} on:mousemove={(e) => {if(isHueClicked) handleHueClick(e); if(isClicked) handleClick(e)}}/>

<style lang="scss">
    main {
        display: flex;
        align-items: center;
        height:calc(100% - 20px);
        gap: 10px;
        padding: 10px;
        user-select: none;
    }

    .info {
        width: 80px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 5px;
        text-align: center;
        
        .color-preview {
            border-radius: 8px;
            box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
            width: 40px;
            height: 40px;
        }

        p {
            margin: 0;
            width: 100%;
            font-size: 0.7rem;
            color: rgb(134, 134, 134);
        }
    }


    .color-sel {
        position: relative;
        height: 100%;
        width: calc(100% - 135px);
        .color-bg {
            border-radius: 5px;
            height: 100%;
            width: 100%;
            box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
            background: linear-gradient(360deg, rgba(0,0,0,1) 0%, rgba(255,0,0,0) 100%), linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(255,0,0,1) 100%);
        }

        .pointer {
            width: 5px;
            height: 5px;
            border-radius: 5px;
            border: 1px solid white;
            backdrop-filter: invert(100%) grayscale(100%);
            position: absolute;
            top:0px;
            pointer-events: none;
            translate: -4px -4px;
        }
    }

    .selector{ 
        width:25px;
        height: 100%;
        display: flex;
        position: relative;
        gap: 2px;
        margin-left: 6px;
        img {
            width: 20px;
            height: 100%;
            border-radius: 4px;
        }

        .hue-pointer {
            position: absolute;
            left: -8px;
            height: 0;
            width: 0;
            background-color: transparent;
            border-top: 5px solid transparent;
            border-bottom: 5px solid transparent;
            border-left: 5px solid rgb(196, 196, 196);
            translate: 0px -5px;
        }
    }
</style>