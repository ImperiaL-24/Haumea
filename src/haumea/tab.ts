import { derived, get, writable, type Writable } from "svelte/store";
import {v4 as uuidv4} from "uuid";
import { open, save } from '@tauri-apps/api/dialog';
import { readBinaryFile, writeBinaryFile } from '@tauri-apps/api/fs';
import { encode } from "base64-arraybuffer";
import { CanvasData } from "haumea/canvas";
import { Signal } from "src/util";

export class ProjectTabType {
    static HOME = new ProjectTabType("HOME","icons/home.svg");
    static SETTINGS = new ProjectTabType("SETTINGS","icons/settings.svg");
    static IMAGE = new ProjectTabType("IMAGE","icons/picture.svg");
    constructor(public name: string, public icon:string) {}
} 

export class ProjectTab {
    readonly id: string;
    path?: string;
    type: ProjectTabType;
    tabName: string;
    canvasData?: CanvasData;
    onProjectSave: Signal = new Signal();
    constructor(type: ProjectTabType, name: string, data?: CanvasData) {
        this.id = uuidv4();
        this.type = type;
        this.tabName = name;
        if(data == undefined) {
            this.canvasData = type == ProjectTabType.IMAGE ? new CanvasData() : undefined
        } else {
            this.canvasData = data;
        }
    }
    setPath(path: string) {
        this.path = path;
        this.tabName = this.tabName = this.path.match(/(?<=\\)\w+\.\w+$/)[0];
    }
    async saveData() {
        if(!this.canvasData) return;
        this.canvasData.savedState.value = this.canvasData.currentState.value;
        if(!this.path) {
            this.setPath(await save({
                defaultPath: this.tabName,
                filters: [{
                    name: 'Image',
                    extensions: ['png', 'jpeg']
                }]
            }));
        }
        
        const layer = this.canvasData.get().flatten();
        console.log(layer.ctx.getImageData(0,0,layer.canvas.width, layer.canvas.height).data);
        let blob = await layer.canvas.convertToBlob();
        await writeBinaryFile(this.path, await blob.arrayBuffer());
        console.log(this.path);
        this.onProjectSave.signal();
    }
}

export class App {
    static tabs: Map<string, ProjectTab> = new Map();
    private static activeTabId: string;

    static currentTabChange: Signal = new Signal();
    static tabsChange: Signal = new Signal();

    static get activeTab(): ProjectTab {
        return this.tabs.get(this.activeTabId)
    }

    static set activeTab(tab: ProjectTab) {
        this.activeTabId = tab.id;
        currentTabChange.signal();
    }

    static openTab(tab: ProjectTab) {
        this.tabs.set(tab.id, tab);
        tabsChange.signal();
        this.activeTab = tab;
    }
    static closeTab(tab: ProjectTab) {
        //TODO: ARE YOU SURE MODAL IF UNSAVED
        if(this.activeTab.id == tab.id) {
            const keys = Array.from(this.tabs.keys());
            let index = keys.indexOf(tab.id);
            if(index==0 && keys.length==1) return;
            if(index!=0) index--;
            else index++;
            this.activeTab = this.tabs[keys[index]];
        }
        this.tabs.delete(tab.id)
        this.tabsChange.signal();
    }
    static async openFile() {
        const selected = await open({
            multiple: false,
            filters: [{
                name: 'Image',
                extensions: ['png', 'jpeg']
            }]
        });
        // user selected multiple files
        if (Array.isArray(selected)) return;
        // user cancelled the selection
        if (selected === null)  return;
            
        // read binary array
        const contents = await readBinaryFile(selected);
        //convert to base64 image
        var image = new Image();
        image.src = "data:image/png;base64,"+encode(contents);
        await image.decode();
    
        //convert image to canvas
        let canvas = document.createElement('canvas');
                
        canvas.width = image.width;
        canvas.height = image.height;
        let ctx = canvas.getContext("2d");
        ctx.drawImage(image, 0,0);
            
        //convert canvas to imagedata
        const project = new ProjectTab(ProjectTabType.IMAGE, selected, new CanvasData(ctx.getImageData(0,0,canvas.width, canvas.height)));
        project.setPath(selected);
        this.openTab(project);
    }
}

export const tabs: Writable<Map<string, ProjectTab>> = writable(new Map());
export const currentTabId: Writable<string> = writable();

export const currentTab = derived([tabs, currentTabId], ([$tabs, $currentTabId]) =>$tabs.get($currentTabId));

export const currentTabChange: Signal = new Signal();
export const tabsChange: Signal = new Signal();