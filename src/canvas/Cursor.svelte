<script lang="ts">
    import { ToolType } from "../engine/tool/Tool";
    import { currentTool } from "../engine/tool/ToolManager";
    import { mousePos } from "../store";


    let src: string = "cursor.png";
    $: {
        src = ToolType[$currentTool.type].icon;
    }
</script>

<img draggable="false" style="top:{$mousePos[1]}px; left:{$mousePos[0]}px;" src="{src}" class="white" alt="cursor">

<style lang="scss">
    img {
        position: fixed;
        height: 25px;
        width: 25px;
        cursor: none;
        pointer-events: none;
    }
</style>