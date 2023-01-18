import { writable, type Writable } from "svelte/store";

export let canvas: Writable<HTMLCanvasElement> = writable();
export let canvasBase: Writable<HTMLDivElement> = writable();
export let ctx: Writable<CanvasRenderingContext2D> = writable();
export let zoom: Writable<number> = writable(1);
export let transition: Writable<boolean> = writable(true);