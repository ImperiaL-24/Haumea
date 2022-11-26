import { writable } from "svelte/store";

export let indexCount = writable(1)
export let mousePos = writable([0,0])
export let mouseDelta = writable([0,0])
export let currentWindow = writable("")
