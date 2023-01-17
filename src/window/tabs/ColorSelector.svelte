<script lang="ts">
    import { Color } from "../../engine/Color";
    import { currentColor } from "../../engine/ColorManager";


    import { getImage } from "../../engine/ColorSelector";
    let canvas: HTMLCanvasElement;
    let isClicked: boolean;
    let isHueClicked: boolean;
    let hue = $currentColor.asHSV()[0];
    let huebar: HTMLImageElement;

    let hueIndicatorPosition: number = 0;
    
    $: {
        hue;
        if(canvas!=null) {
            let ctx = canvas.getContext("2d");
            let idata = ctx.createImageData(255, 255);

            // set our buffer as source
            idata.data.set(getImage($currentColor.asHSV()[0]));

            // update canvas with new data
            ctx.putImageData(idata, 0, 0);
        }
        
    }

    let handleClick = (e) => {
        let location = getMappedClickLocation(canvas,e);
        $currentColor = Color.newFromHSV(hue,location.x,1-location.y);
    }
    let handleHueClick = (e) => {

        hueIndicatorPosition = getClickLocation(huebar,e).y;

        hue = Math.round(getMappedClickLocation(huebar,e).y*360);

        let hsv = $currentColor.asHSV();
        $currentColor = Color.newFromHSV(hue, hsv[1],hsv[2]);

        
    }
    /**
     * Gets the click location relative to a HTML Element. Returns an (x,y) pair with x,y = [0,1]
     * @param obj Clicked object
     * @param event mouse event
     */

    function getMappedClickLocation(obj: HTMLElement, event:any): {x:number, y:number} {
        const rect = obj.getBoundingClientRect();
        // Formula -> clamp(MouseCoordinate - ElementCoordinate) / Dimension;
        return {
            x: Math.max(0,Math.min(rect.width,(event.pageX-Math.floor(rect.left + window.scrollX)+1)))/rect.width,
            y: Math.max(0,Math.min(rect.height,(event.pageY-Math.floor(rect.top + window.scrollY)+1)))/rect.height
        };
    }

    /**
     * Gets the click location relative to a HTML Element. Returns an (x,y) pair.
     * @param obj Clicked object
     * @param event mouse event
     */

     function getClickLocation(obj: HTMLElement, event:any): {x:number, y:number} {
        const rect = obj.getBoundingClientRect();
        // Formula -> clamp(MouseCoordinate - ElementCoordinate);
        return {
            x: Math.max(0,Math.min(rect.width,(event.pageX-Math.floor(rect.left + window.scrollX)+1))),
            y: Math.max(0,Math.min(rect.height,(event.pageY-Math.floor(rect.top + window.scrollY)+1)))
        };
    }
</script>

<main>
    <div class="info">
        <div class="color-preview" style="{`background-color:${$currentColor.asHex()}; width:40px; height:40px;`}"></div>
        <p>{$currentColor.asHex()}</p>
    </div>
    
    <canvas width="255" height="255" 
    bind:this={canvas} 
    on:mousedown={(e) => {isClicked = true;handleClick(e)}} 
    />
    <div class="selector">
        <img 
        bind:this={huebar}
        src="hue.png" 
        alt="color-picker" 
        draggable="false"
        on:mousedown={(e) => {isHueClicked = true; handleHueClick(e)}} 
        
        />
        <div class="indicator" style="{`top:${hueIndicatorPosition+ 48}`}px"></div>
    </div>

    
    
</main>

<svelte:window on:mouseup={() => {isClicked=false; isHueClicked = false}} on:mousemove={(e) => {if(isHueClicked) handleHueClick(e); if(isClicked) handleClick(e)}}/>

<style lang="scss">
    .info {
        width: 80px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 5px
    }
    .color-preview {
        border-radius: 8px;
        box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
    }
    p {
        margin: 0;
        width: 100%;
        font-size: 0.7rem;
        color: rgb(134, 134, 134);
    }
    main {
        display: flex;
        align-items: center;
        height:calc(100% - 20px);
        gap: 10px;
        padding: 10px;
    }
    .selector{ 
        width:20px;
        height: 100%;
    }
    img {
        width: 20px;
        height: 100%;
    }
    input {
        transform-origin: left 0;
        rotate: -90deg;
        margin: 0;
        height: 100%;
        width: 100%;
    }

    .indicator {
        height: 5px;
        width: 5px;
        position: absolute;
        background-color: aqua;
    }
</style>