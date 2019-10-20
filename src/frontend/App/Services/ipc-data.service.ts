import { Injectable } from "@angular/core";
import { IpcRenderer } from "electron";
import { Observable, of, Subject } from "rxjs";
import { IDevice, IPage, ISelectableOption } from "../../../common/rest";
import { IDataService } from "./definitions";

interface ICapabilitiesDictionary {
    [key: string]: ISelectableOption[];
}

@Injectable()
export class DataService implements IDataService {

    /**
     * Internal properties
     */
    private cachedPages: IPage[];
    private defaultCachedPages: IPage[] = [];
    private isGettingPages = false;
    private cachedDevices: IDevice[];
    private defaultCachedDevices: IDevice[] = [];
    private isGettingDevices = false;
    private cachedCapabilities: ICapabilitiesDictionary = {};

    /**
     * Initializes a new instance from the Data class.
     * @param ipcRenderer the inter process communication with backend
     */
    constructor(private ipcRenderer: IpcRenderer) {}

    /**
     * Gets the current cached pages
     */
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

    /**
     * Gets the current cached devices
     */
    public get devices(): IDevice[] {
        if (this.cachedDevices) {
            return this.cachedDevices;
        }

        if (!this.isGettingDevices) {
            this.isGettingDevices = true;
            this.updateDevices();
        }

        return this.defaultCachedDevices;
    }

    /**
     * Get the options available for a particular device capability
     * @param capability the capability to be queried
     */
    public getCapabilities(capability: string): Observable<ISelectableOption[]> {
        if (this.cachedCapabilities[capability]) {
            return of(this.cachedCapabilities[capability]);
        }

        return this.getCapabilitiesFromModel(capability);
    }

    /**
     * Request a new page
     */
    public addNewPage(deviceId: number) {
        this.ipcRenderer.once("pages:add", () => {
            this.updatePages();
        });

        this.ipcRenderer.send("pages:add", deviceId);
    }

    // tslint:disable: no-empty
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

    private updateDevices() {
        this.ipcRenderer.once("devices:get", (event: any, devices: IDevice[]) => {
            this.cachedDevices = devices;
        });
        this.ipcRenderer.send("devices:get");
    }

    private getCapabilitiesFromModel(capability: string): Observable<ISelectableOption[]> {
        const capabilitiesResult = new Subject<ISelectableOption[]>();

        this.ipcRenderer.once("devices:capabilities", (event: any, options: ISelectableOption[]) => {
            this.cachedCapabilities[capability] = options;
            capabilitiesResult.next(options);
            capabilitiesResult.complete();
        });

        // this.ipcRenderer.send("devices:capabilities", capability);

        return capabilitiesResult;
    }
}
