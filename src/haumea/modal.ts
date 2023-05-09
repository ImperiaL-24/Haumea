import { writable, type Writable } from "svelte/store";

export enum Modal {
    NEW_PROJECT,
    CONFIRM
}

export let activeModal: Writable<Modal | null> = writable(null);

