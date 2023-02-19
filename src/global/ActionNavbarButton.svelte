<script lang="ts">
    import type { Action } from "src/haumea/keybind";
    import NavbarButton from "./NavbarButton.svelte";


    export let disabled: boolean = false;
    export let action: Action;
</script>

<NavbarButton name={action.name} keybind={action.keybind.toString()} action={() => action.run()} disabled={disabled} icon={action.icon}></NavbarButton>
