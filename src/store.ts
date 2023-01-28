import { writable, type Writable } from "svelte/store";
import { Color } from "./engine/Color";
import { currentColor } from "./engine/ColorManager";
import { Vector2 } from "./engine/Vector2";
import type Anchor from "./window/anchor/Anchor";
import type Window from "./window/Window";

export class ClickState {
    target: HTMLElement;
    leftClick: boolean = false;
    rightClick: boolean = false;;

    position: Vector2 = new Vector2();
    delta: Vector2 = new Vector2();
    leftClickDelta: Vector2 = new Vector2();
    rightClickDelta: Vector2 = new Vector2();
    static from(state: ClickState): ClickState {
        let newState = new ClickState();
        newState.target = state.target;

        newState.leftClick = state.leftClick;
        newState.rightClick = state.rightClick;

        newState.position = state.position;
        newState.delta = state.delta;

        newState.leftClickDelta = state.leftClickDelta;
        newState.rightClickDelta = state.rightClickDelta;
        return newState;
    }
    constructor() {};
}

export class ModifierState {
    shiftKey: boolean = false;
    altKey: boolean = false;
    ctrlKey: boolean = false;
    static from(state: ModifierState): ModifierState {
        let newState = new ModifierState();
        newState.shiftKey = state.shiftKey;
        newState.altKey = state.altKey;
        newState.ctrlKey = state.ctrlKey;
        return newState;
    }
    constructor() {};
}

// WINDOW STORES
export let isWindowFocused = writable(false);
// NAVBAR STORES
export let navbarPressed = writable(false);
export let activeDropdown = writable("");
export let clickState = writable(new ClickState())
export let modifierState = writable(new ModifierState())

// WINDOW STORES
export let indexCount = writable(10)
export let currentWindow = writable("")
// Map of all current windows on the screen
export let windows: Writable<Map<string,Window>> = writable(new Map())
export let windowRerender = writable(false);
export let innerRect: Writable<{x:number, y:number, height:number, width:number}> = writable({x:0,y:0,height:0,width:0});
export let anchors: Writable<Map<string,Anchor>> = writable(new Map())


// COLOR STORES
export let colorTarget: Writable<[number, number, number]> = writable([0,0,0])
colorTarget.subscribe(n => {
    currentColor.set(Color.newFromHSV(n[0], n[1], n[2]));
})



