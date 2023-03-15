import sveltePreprocess from "svelte-preprocess";
import { ddPreprocess } from "./dd.js";
export default {
  preprocess: [
    ddPreprocess,
    sveltePreprocess()
  ]
};
