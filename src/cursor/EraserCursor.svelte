<script lang="ts">
    import type { Tool } from "src/engine/tool/Tool";
        import { App, CanvasProjectTab } from "haumea/tab";
    import type { EraserTool } from "src/engine/tool/EraserTool";
    
    export let instance: Tool;
    const tool = instance as EraserTool;
    let cursorSize: number;
    
    $$: App.activeTabChange => let activeCanvas: CanvasProjectTab = App.activeCanvas;
    
    $$: $: activeCanvas?.zoomChange => let zoom = activeCanvas.zoom;
    
    $: {
        tool.size.subscribe(n => {
            cursorSize = zoom*n;
        });
    }
    </script>

    <div class="main" style="height: {cursorSize}px; width: {cursorSize}px;">
        <div class="linex"></div>
    </div>

    <style lang="scss">
        .main {
            position: relative;
            height: 18px;
            width: 18px;
            translate: -50% -50%;
            background-color: none;
            transition: all 0.2s;
            border: 1px solid white;
            box-shadow:inset 0px 0px 0px 1px rgb(0, 0, 0);
            border-radius: 5%;
    
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .linex {
            position: absolute;
            height: 1px;
            width: 15%;
            border: 1px solid white;
            box-shadow:inset 0px 0px 0px 1px rgb(0, 0, 0);
        }
    </style>