import { writable, type Writable } from "svelte/store";
import type Window from "./window/Window";

export let indexCount = writable(10)
export let mousePos = writable([0,0])
export let mouseDelta = writable([0,0])
// delta from mousedown position to current position;
export let mouseClickDelta = writable([0,0])
export let isClicking = writable(false);

export let currentWindow = writable("")
// Map of all current windows on the screen
export let windows: Writable<Map<string,Window>> = writable(new Map())
export let windowRerender = writable(false);

export let colorTarget: Writable<[number, number, number]> = writable([0,0,0])