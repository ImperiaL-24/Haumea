import { writable, type Writable } from "svelte/store";
import { Color } from "./Color";

export let currentColor: Writable<Color> = writable(new Color(10,60,78));