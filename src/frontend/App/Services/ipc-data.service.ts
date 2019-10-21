import { Injectable } from "@angular/core";
import { IpcRenderer } from "electron";
import { Observable, of, Subject } from "rxjs";
import {
    IDevice,
    INewDeviceParams,
    IPage,
    ISelectableOption,
    IUpdateDeviceParams,
    IUpdateParams } from "../../../common/rest";
import { IDataService } from "./definitions";
import { LogService } from "./log.service";

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
     * @param log the front end logger
     */
    constructor(
        private ipcRenderer: IpcRenderer,
        private log: LogService) {}

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

    /**
     * Request a new device
     * @param name The name for the new device
     */
    public addNewDevice(name: string) {
        this.ipcRenderer.once("devices:add", () => {
            this.updateDevices();
        });

        this.ipcRenderer.send("devices:add", { name } as INewDeviceParams);
    }

    /**
     * Delete an existing page
     * @param idToDelete is the id for the page to be deleted
     */
    public deletePage(idToDelete: number) {
        this.ipcRenderer.once("pages:delete", (event: any, success: boolean) => {
            if (success) {
                this.updatePages();
            } else {
                this.log.error(`Error while deleting page id: ${idToDelete}`);
            }
        });

        this.ipcRenderer.send("pages:delete", idToDelete);
    }

    /**
     * Delete an existing device
     * @param idToDelete is the id for the device to be deleted
     */
    public deleteDevice(idToDelete: number) {
        this.ipcRenderer.once("devices:delete", (event: any, success: boolean) => {
            if (success) {
                this.updateDevices();
            } else {
                this.log.error(`Error while deleting device id: ${idToDelete}`);
            }
        });

        this.ipcRenderer.send("devices:delete", idToDelete);
    }

    /**
     * Updates the name for a device
     * @param id the id for the device to be updated
     * @param newValue the new value for the update
     */
    public updateDeviceName(id: number, newValue: string) {
        const data: IUpdateDeviceParams = { id, newValue };

        this.ipcRenderer.once("devices:update", (event: any, success: boolean) => {
            if (success) {
                this.updateDevices();
            } else {
                this.log.error(`Error while deleting device id: ${id}`);
            }
        });

        this.ipcRenderer.send("devices:update", data);
    }

    /**
     * Updates a particular field for a set of pages
     * @param field The field to be updated
     * @param pages The pages to be updated
     * @param newValue The new value to be set
     */
    public updatePageField(field: string, pages: number[], newValue: string) {
        const update = { pages, newValue } as IUpdateParams;

        this.ipcRenderer.once("pages:update", (event: any, success: boolean) => {
            if (success) {
                this.updatePages();
            } else {
                this.log.error(`Error while updating pages : ${ pages.toString() }`);
            }
        });

        this.ipcRenderer.send("pages:update", field, update);
    }

    /**
     * Private methods
     */

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

        this.ipcRenderer.send("devices:capabilities", capability);

        return capabilitiesResult;
    }
}
