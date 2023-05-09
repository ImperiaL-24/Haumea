<div class="modal">
    <div class="bar"></div>
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
    transition: opacity 0.2s, outline-width 0.1s;

}
</style>