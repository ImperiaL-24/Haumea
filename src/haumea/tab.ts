import { getCanvasData, setCanvasData } from "src/haumea/preview";
import { Reactive } from "src/util";
import { derived, get, writable, type Writable } from "svelte/store";
import {v4 as uuidv4} from "uuid";
import { PercentagePos } from "./math";
import { open } from '@tauri-apps/api/dialog';
import { readBinaryFile, BaseDirectory } from '@tauri-apps/api/fs';
import { encode } from "base64-arraybuffer";

export class ProjectTabType {
    static HOME = new ProjectTabType("HOME","svelte.svg");
    static SETTINGS = new ProjectTabType("SETTINGS","icons/settings.svg");
    static IMAGE = new ProjectTabType("IMAGE","icons/picture.svg");
    constructor(public name: string, public icon:string) {}
} 

export class ProjectTab {
    readonly id: string;
    isSaved: boolean;
    //TODO: PATH CHECKING WHEN IMPORTING, AUTO SAVE TO LOCATION IF CTRL S, DONT AUTO SAVE IF CTRL S AND NO PATH, MAKE PATH ON PROJECT SAVE
    path: string;
    type: ProjectTabType;
    tabName: string;
    canvasData?: CanvasImageData;
    constructor(type: ProjectTabType, name: string, data?: CanvasImageData) {
        this.id = uuidv4();
        this.type = type;
        this.tabName = name;
        if(data == undefined) {
            this.canvasData = type == ProjectTabType.IMAGE ? new CanvasImageData() : undefined
        } else {
            this.canvasData = data;
        }
        
        console.log(data)
    }
}

export class CanvasImageData {
    currentState: number = -1;
    stateList: ImageData[] = [];
    position: Reactive<PercentagePos> = new Reactive(new PercentagePos(50,50));
    zoom: Reactive<number> = new Reactive(1);

    canUndo: Writable<boolean> = writable(false);
    canRedo: Writable<boolean> = writable(false);
    constructor(data?: ImageData) {
        console.log(data)
        this.stateList.push(data ?? new ImageData(16,16));
        
    }
    get() {
        return this.stateList[this.stateList.length+this.currentState];
    }
    saveState() {
        this.stateList.splice( this.stateList.length+this.currentState+1, -this.currentState+1);
        this.stateList.push(getCanvasData());

        this.currentState= -1;
        this.updateBooleans();
    }
    undo() {
        if(!get(this.canUndo)) return;
        setCanvasData(this.stateList.slice(this.currentState-1)[0]);
        this.currentState--;
        console.log("undo", this.canUndo)
        this.updateBooleans()
    }
    redo() {
        if(!(get(this.canRedo))) return;
            setCanvasData(this.stateList.slice(this.currentState+1)[0]);
            this.currentState++;
            console.log("redo", this.stateList, this.currentState)
            this.updateBooleans()
    }
    private updateBooleans() {
        this.canUndo.set(this.currentState != -50 && this.stateList.length != -this.currentState);
        this.canRedo.set(this.currentState != -1);
    }
}

export const tabs: Writable<Map<string, ProjectTab>> = writable(new Map());
export const currentTabId: Writable<string> = writable();

export const currentTab = derived([tabs, currentTabId], ([$tabs, $currentTabId]) =>$tabs.get($currentTabId));

export let setCurrentTab = (id: string) => {
    currentTabId.set(id);
}

export let openTab = (tab: ProjectTab) => {
    tabs.update(n => {
        n.set(tab.id, tab);
        return n;
    })
    currentTabId.set(tab.id);

}

export let openFile = async () => {
    const selected = await open({
        multiple: false,
        filters: [{
            name: 'Image',
            extensions: ['png', 'jpeg']
        }]
    });
    if (Array.isArray(selected)) {
        // user selected multiple files
      } else if (selected === null) {
        // user cancelled the selection
      } else {
        
        const contents = await readBinaryFile(selected);
        console.log()
        var image = new Image();
        image.src = "data:image/png;base64,"+encode(contents);
        await image.decode();
        console.log("yippie");
        var canvas = document.createElement('canvas');
            
        canvas.width = image.width;
        canvas.height = image.height;
        let ctx = canvas.getContext("2d");
        ctx.drawImage(image, 0,0);
        
        const project = new ProjectTab(ProjectTabType.IMAGE, selected, new CanvasImageData(ctx.getImageData(0,0,canvas.width, canvas.height)));
        openTab(project);
      }
}

export let closeTab = (id: string) => {
    //TODO: ARE YOU SURE MODAL IF UNSAVED

    if(get(currentTab).id == id) {
        const keys = Array.from(get(tabs).keys());
        let index = keys.indexOf(id);
        if(index==0 && keys.length==1) return;
        if(index!=0) index--;
        else index++;
        currentTabId.set(keys[index]);
    }
    
    
    tabs.update(n => {
        n.delete(id);
        return n;
    })
    
}