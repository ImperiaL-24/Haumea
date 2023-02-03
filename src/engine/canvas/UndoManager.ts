import { currentTab } from "src/haumea/tab";
import { get, writable, type Writable } from "svelte/store";
import { getCanvasData, setCanvasData } from "../../haumea/preview";


export let currentState: Writable<number> = writable(-1);
export let stateList: Writable<ImageData[]> = writable([]);
export let saveCanvas = () => {
    // stateList.update(n => {
    //     n.splice(n.length+get(currentState)+1, -get(currentState)+1);
    //     n.push(getCanvasData());
    //     return n;
    // })

    // currentState.set(-1);
    get(currentTab).canvasData.saveState();
    console.log(get(currentTab))
}

export let undo = () => {
    // if(get(currentState) == -50 || get(stateList).length == -get(currentState)) return;
    // setCanvasData(get(stateList).slice(get(currentState)-1)[0]);
    // currentState.set(get(currentState)-1);
    // console.log("undo", stateList, currentState)
    get(currentTab).canvasData.undo();
}

export let redo = () => {
    get(currentTab).canvasData.redo();
}

