import { writable, type Writable } from "svelte/store";
import { Color } from "../haumea/color";

export let currentColor: Writable<Color> = writable(new Color(0,0,0));