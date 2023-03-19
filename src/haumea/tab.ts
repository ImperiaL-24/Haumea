import {v4 as uuidv4} from "uuid";
import { open, save } from '@tauri-apps/api/dialog';
import { readBinaryFile, readTextFile, writeBinaryFile, writeTextFile } from '@tauri-apps/api/fs';
import { encode } from "base64-arraybuffer";
import { CanvasState, Layer } from "haumea/canvas";
import { Signal } from "src/util";
import { PercentagePos } from "./math";

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
    onProjectSave: Signal = new Signal();
    constructor(path?: string) {
        super(ProjectTabType.IMAGE,path ? path.match(/(?<=\\)\w+\.\w+$/)[0] : "Untitled")
        this._path = path;
        this.stateList[0] = new CanvasState(this, new ImageData(100,100));
    }

    static fromData(data: ImageData, path?: string,) {
        let tab = new CanvasProjectTab(path);
        tab.stateList[0] = new CanvasState(tab, data);
        return tab;
    }

    private currentState: number = -1;
    private savedState: number = -1;
    private stateList: CanvasState[] = [];

    private _position: PercentagePos = new PercentagePos(50, 50);
    private _zoom: number = 1;

    activeStateChange: Signal = new Signal();
    positionChange: Signal = new Signal();
    zoomChange: Signal = new Signal();

    get activeState() {
        return this.stateList[this.stateList.length + this.currentState];
    }
    setState(state: CanvasState) {
        this.stateList[0] = state;
    }
    addState() {
        this.stateList.splice(this.stateList.length + this.currentState + 1, -this.currentState - 1);
        
        this.savedState -= this.currentState + 2;
        this.currentState = -1;
        const newState = CanvasState.from(this.activeState);
        this.stateList.push(newState);
        
        this.activeStateChange.signal();
        return newState;
    }
    save() {
        this.savedState = this.currentState;
    }
    isSaved() {
        return this.savedState == this.currentState;
    }
    undo() {
        if (!this.canUndo) return;
        this.currentState--;

        this.activeStateChange.signal();
        console.log(this.savedState, this.currentState);
    }
    redo() {
        if (!this.canRedo) return;
        this.currentState++;

        this.activeStateChange.signal();
        console.log(this.savedState, this.currentState);
    }


    get canUndo() {
        return this.currentState != -50 && this.stateList.length != -this.currentState;
    }

    get canRedo() {
        return this.currentState != -1
    }

    set position(newPos: PercentagePos) {
        this._position = newPos;
        this.positionChange.signal();
    }

    get position() {
        return this._position;
    }

    set zoom(newZoom: number) {
        this._zoom = newZoom;
        this.zoomChange.signal();
    }

    get zoom() {
        return this._zoom;
    }

    set path(path: string) {
        if(!path) return;
        this._path = path;
        this.tabName = this.tabName = this.path.match(/(?<=\\)\w+\.\w+$/)[0];
    }

    get path() {
        return this._path;
    }
    
    async exportData() {
        this.save();
        if(!this.path || this.path.endsWith(".hpr")) {
            this.path = await save({
                defaultPath: this.tabName,
                filters: [{
                    name: 'Image',
                    extensions: ['png']
                }]
            });
        }
        
        const layer = this.activeState.flatten();
        console.log(layer.ctx.getImageData(0,0,layer.canvas.width, layer.canvas.height).data);
        let blob = await layer.canvas.convertToBlob();
        await writeBinaryFile(this.path, await blob.arrayBuffer());
        console.log(this.path);
        this.onProjectSave.signal();
    }
    async saveData() {
        if(this.activeState.layers.length == 1) {
            await this.exportData();
            return;
        }
        this.save();
        if(!this.path || this.path.endsWith(".png")) {
            this.path = await save({
                defaultPath: this.tabName,
                filters: [{
                    name: 'Haumea Project',
                    extensions: ['hpr']
                }]
            });
        }
        await writeTextFile(this.path, JSON.stringify(await this.activeState.asJSON()));
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
            filters: [
            {
                name: 'All',
                extensions: ['*']
            },{
                name: 'Image',
                extensions: ['png', 'jpeg']
            },{
                name: 'Haumea Project',
                extensions: ['hpr']
            }]
        });
        // user selected multiple files
        if (Array.isArray(selected)) return;
        // user cancelled the selection
        if (selected === null)  return;

        if(!selected.match(/.*\.(png|hpr|jpeg)/)) return;

        if(selected.endsWith(".hpr")) {
            const contents = JSON.parse(await readTextFile(selected));
            const project = new CanvasProjectTab(selected)

            const state = await CanvasState.fromJSON(project, contents)
            project.setState(state);
            this.openTab(project);

            return;
        }

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
        const project = CanvasProjectTab.fromData(ctx.getImageData(0,0,canvas.width, canvas.height), selected);
        this.openTab(project);
    }
}