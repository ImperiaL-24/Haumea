import { writable, type Writable } from "svelte/store";
import type { TabType } from "./window/TabType";
import WindowData from "./window/WindowData";
import {v4 as uuidv4} from "uuid";

export let indexCount = writable(1)
export let mousePos = writable([0,0])
export let mouseDelta = writable([0,0])
export let currentWindow = writable("")
// Map of all current windows on the screen
export let windows: Writable<Map<string,WindowData>> = writable(new Map())
export let windowRerender = writable(false);
export let addWindow = (...tabs: TabType[]) => {
    let id = uuidv4();
    windows.update(n => {
        n.set(id, new WindowData(id, ...tabs))
        return n
    })
}

export let colorTarget: Writable<[number, number, number]> = writable([0,0,0])