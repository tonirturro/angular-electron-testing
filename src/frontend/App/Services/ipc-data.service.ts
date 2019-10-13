import { Injectable } from "@angular/core";
import { IpcRenderer } from "electron";
import { Observable } from "rxjs";
import { IDevice, IPage, ISelectableOption } from "../../../common/rest";
import { IDataService } from "./definitions";

@Injectable()
export class DataService implements IDataService {

    /**
     * Internal properties
     */
    private cachedPages: IPage[];
    private defaultCachedPages: IPage[] = [];
    private isGettingPages = false;

    constructor(private ipcRenderer: IpcRenderer) {}

    public get pages(): IPage[] {
        if (this.cachedPages) {
            return this.cachedPages;
        }

        if (!this.isGettingPages) {
            this.isGettingPages = true;
            this.updatePages();
        }

        return this.defaultCachedPages;
    }

    public get devices(): IDevice[] {
        return [];
    }

    public getCapabilities(capability: string): Observable<ISelectableOption[]> {
        return new Observable();
    }

    // tslint:disable: no-empty
    public addNewPage(deviceId: number) {}
    public addNewDevice(name: string) {}
    public deletePage(idToDelete: number) {}
    public deleteDevice(idToDelete: number) {}
    public updateDeviceName(id: number, newValue: string) {}
    public updatePageField(field: string, pages: number[], newValue: string) {}

    private updatePages() {
        this.ipcRenderer.once("pages:get", (event: any, pages: IPage[]) => {
            this.cachedPages = pages;
        });
        this.ipcRenderer.send("pages:get");
    }
}
