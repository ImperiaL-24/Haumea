<script lang="ts">
    import { Action } from "src/haumea/keybind";
    import HomeButton from "./HomeButton.svelte";


</script>

<div class="highlight"></div>
<div class="left">
    <div class="title">
        <img src="icon.png" alt="icon">
        <div>
            <p class="title">Haumea</p>
            <p class="descr">Welcome Back!</p>
        </div>
    </div>
    <div class="buttons">
        <HomeButton action={Action.NEW_TAB} main/>
        <HomeButton action={Action.OPEN}/>
    </div>
    
</div>

<style lang="scss">
.highlight {
    position: absolute;
    height: 125%;
    width: 200%;
    top:-64px;
    left: -50%;
    background: radial-gradient(ellipse at 50% -200%, rgb(204, 60, 60) 30%, rgba(255, 0, 0, 0) 70%);
    background-size: 100% 80%;
    background-repeat: no-repeat;
    opacity: 0.8;
    transition: all 0.2s;
    z-index: -1;
}


.left {
    padding: 4em 0px 25px 100px;
    width: 50%;
    .title {
        display: flex;
        align-items: center;
        gap: 2em;
        img {
            height: 8em;
        }

        & > div {
            display: flex;
            flex-direction: column;
            justify-content: center;
            p {
                color: white;
                font-size: 1.2em;
                margin: 0;
            }
            .title {
                font-size: 4em;
                height: 1em;
            }
        }
    }

    .buttons {
        display: flex;
        flex-direction: column;
        gap: 10px;
        padding-top: 4em;
        width: 50%;
    }
}

</style>