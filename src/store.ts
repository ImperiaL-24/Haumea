import { writable, type Writable } from "svelte/store";
import type Anchor from "./window/anchor/Anchor";
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

export let anchors: Writable<Map<string,Anchor>> = writable(new Map())

export let colorTarget: Writable<[number, number, number]> = writable([0,0,0])

export let innerRect: Writable<{x:number, y:number, height:number, width:number}> = writable({x:0,y:0,height:0,width:0});