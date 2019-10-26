import { Injectable } from "@angular/core";
import { IpcRenderer } from "electron";

@Injectable()
export class ElectronService {
    private ipcRendererLocal: IpcRenderer;

    public get ipcRenderer(): IpcRenderer {
        return this.ipcRendererLocal;
    }

    constructor() {
        this.ipcRendererLocal = (window as any).require ? (window as any).require("electron").ipcRenderer : null;
    }
}
