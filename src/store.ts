import { writable, type Writable } from "svelte/store";
import type { TabType } from "./window/TabType";
import WindowData from "./window/WindowData";
import {v4 as uuidv4} from "uuid";

export let indexCount = writable(10)
export let mousePos = writable([0,0])
export let mouseDelta = writable([0,0])
// delta from mousedown position to current position;
export let mouseClickDelta = writable([0,0])
export let isClicking = writable(false);

export let currentWindow = writable("")
// Map of all current windows on the screen
export let windows: Writable<Map<string,WindowData>> = writable(new Map())
export let windowRerender = writable(false);
export let addWindow = (tabless:boolean, ...tabs: TabType[]) => {
    let id = uuidv4();
    windows.update(n => {
        n.set(id, new WindowData(id,tabless, ...tabs))
        return n
    })
}

export let colorTarget: Writable<[number, number, number]> = writable([0,0,0])