import { getCanvasData, setCanvasData } from "./Canvas";


export let currentState: number = -1;
export let stateList: ImageData[] = [];
export let saveCanvas = () => {
    stateList.splice(stateList.length+currentState+1, -currentState+1);
    stateList.push(getCanvasData());
    currentState = -1;
}

export let undo = () => {
    if(currentState == -50) return;
    setCanvasData(stateList.slice(--currentState)[0]);
    console.log("undo", stateList, currentState)
}

export let redo = () => {
    if(currentState == -1) return;
    setCanvasData(stateList.slice(++currentState)[0]);
    console.log("redo", stateList, currentState)
}

