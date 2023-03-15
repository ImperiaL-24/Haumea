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
    type: ProjectTabType;
    tabName: string;
    constructor(type: ProjectTabType, name: string) {
        this.id = uuidv4();
        this.type = type;
        this.tabName = name;
    }

}

export class CanvasProjectTab extends ProjectTab {
    private _path: string;
    data: CanvasData;
    onProjectSave: Signal = new Signal();
    constructor(path?: string, data?: CanvasData) {
        super(ProjectTabType.IMAGE,path ? path.match(/(?<=\\)\w+\.\w+$/)[0] : "Untitled")
        this._path = path;
        this.data = data == undefined ? new CanvasData() : data;
    }
    set path(path: string) {
        this._path = path;
        this.tabName = this.tabName = this.path.match(/(?<=\\)\w+\.\w+$/)[0];
    }
    get path() {
        return this._path;
    }
    async saveData() {
        if(!this.data) return;
        this.data.save();
        if(!this.path) {
            this.path = await save({
                defaultPath: this.tabName,
                filters: [{
                    name: 'Image',
                    extensions: ['png', 'jpeg']
                }]
            });
        }
        
        const layer = this.data.activeState.flatten();
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

    static activeTabChange: Signal = new Signal();
    static tabsChange: Signal = new Signal();

    static get activeTab(): ProjectTab {
        return this.tabs.get(this.activeTabId)
    }

    static get activeCanvas(): CanvasProjectTab | undefined {
        const tab = this.tabs.get(this.activeTabId);
        return tab instanceof CanvasProjectTab ? tab as CanvasProjectTab : undefined;
    }

    static set activeTab(tab: ProjectTab) {
        this.activeTabId = tab.id;
        this.activeTabChange.signal();
    }

    static openTab(tab: ProjectTab) {
        this.tabs.set(tab.id, tab);
        this.tabsChange.signal();
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
            this.activeTab = this.tabs.get(keys[index]);
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
        const project = new CanvasProjectTab(selected, new CanvasData(ctx.getImageData(0,0,canvas.width, canvas.height)));
        this.openTab(project);
    }

}