import { NgZone } from "@angular/core";
import { async, fakeAsync, tick } from "@angular/core/testing";
import { IpcMain, IpcMainEvent } from "electron";
import * as ipcMock from "electron-ipc-mock";
import { PageFields } from "../../../common/model";
import {
    IDevice,
    INewDeviceParams,
    IPage,
    ISelectableOption,
    IUpdateDeviceParams,
    IUpdateParams } from "../../../common/rest";
import { DataService } from "./data.service";
import { ElectronService } from "./electron.service";
import { LogService } from "./log.service";

describe("Given a data service", () => {

    const expectedPages: IPage[] = [{
        destination: "5",
        deviceId: 1,
        id: 1,
        mediaType: "4",
        pageSize: "2",
        printQuality: "3",
    }];
    const expectedDevices: IDevice[] = [{
        id: 1,
        name: "Device 2"
    }];
    const devicePageOptionsResponse: ISelectableOption[] = [
        { value: "0", label: "label0 "}
    ];
    const ExpectedDeviceId = 1;
    const ExpectedPageId = 2;
    const ExpectedDeviceName = "name";
    let electronServiceMock: ElectronService;
    let zoneMock: NgZone;
    let logger: LogService;
    let service: DataService;
    let ipcMain: IpcMain;

    beforeEach(() => {
        const mock = ipcMock();
        ipcMain = mock.ipcMain;
        electronServiceMock = {
            ipcRenderer: mock.ipcRenderer
        } as ElectronService;
        zoneMock = {
            run: (task) => {
                task();
            }
        } as NgZone;
    });

    beforeEach(() => {
        logger = new LogService();
        service = new DataService(electronServiceMock, logger, zoneMock);
    });

    it("Should be created", () => {
        expect(service).toBeTruthy();
    });

    it("When the pages are not yet fetched they should retrive an empty array", () => {
        expect(service.pages.length).toEqual(0);
    });

    it("When the pages are fetched they should be retrieved", fakeAsync(() => {
        ipcMain.once("pages:get", (event: IpcMainEvent) => {
            event.sender.send("pages:get", expectedPages);
        });

        const initialPages = service.pages;
        tick();
        const finalPages = service.pages;

        expect(initialPages.length).toEqual(0);
        expect(finalPages).toEqual(expectedPages);
    }));

    it("When the devices are not yet fetched they should retrive an empty array", () => {
        expect(service.devices.length).toEqual(0);
    });

    it("When the devices are fetched they should be retrived", fakeAsync(() => {
        ipcMain.once("devices:get", (event: IpcMainEvent) => {
            event.sender.send("devices:get", expectedDevices);
        });

        const initialDevices = service.devices;
        tick();
        const finalDevices = service.devices;

        expect(initialDevices.length).toEqual(0);
        expect(finalDevices).toEqual(expectedDevices);
    }));

    it("Can read device page options", fakeAsync(() => {
        let options: ISelectableOption[];
        ipcMain.once("devices:capabilities", (event: IpcMainEvent) => {
            event.sender.send("devices:capabilities", devicePageOptionsResponse);
        });

        service.getCapabilities(PageFields.PageSize).subscribe((capabilityOptions) => {
            options = capabilityOptions;
        });

        tick();

        expect(options).toEqual(devicePageOptionsResponse);
    }));

    it("Can cache device page options", fakeAsync(() => {
        let options: ISelectableOption[];
        ipcMain.once("devices:capabilities", (event: IpcMainEvent) => {
            event.sender.send("devices:capabilities", devicePageOptionsResponse);
        });

        service.getCapabilities(PageFields.PageSize).subscribe();

        tick();

        service.getCapabilities(PageFields.PageSize).subscribe((capabilityOptions) => {
            options = capabilityOptions;
        });

        expect(options).toEqual(devicePageOptionsResponse);
    }));

    it("Can add pages", async(() => {
        ipcMain.once("pages:add", (event: IpcMainEvent, deviceId: number) => {
            expect(deviceId).toEqual(ExpectedDeviceId);
        });

        service.addNewPage(ExpectedDeviceId);
    }));

    it("When adding a page Then the page list is updated", fakeAsync(() => {
        let updated = false;
        ipcMain.once("pages:add", (event: IpcMainEvent) => {
            event.sender.send("pages:add", true);
        });

        ipcMain.once("pages:get", () => {
            updated = true;
        });

        service.addNewPage(ExpectedDeviceId);
        tick();

        expect(updated).toBeTruthy();
    }));

    it("Can add devices", async(() => {
        ipcMain.once("devices:add", (event: IpcMainEvent, newDevice: INewDeviceParams) => {
            expect(newDevice.name).toEqual(ExpectedDeviceName);
        });

        service.addNewDevice(ExpectedDeviceName);
    }));

    it("When adding a device Then the device list is updated", fakeAsync(() => {
        let updated = false;
        ipcMain.once("devices:add", (event: IpcMainEvent) => {
            event.sender.send("devices:add", true);
        });

        ipcMain.once("devices:get", (event: IpcMainEvent) => {
            updated = true;
        });

        service.addNewDevice(ExpectedDeviceName);
        tick();

        expect(updated).toBeTruthy();
    }));

    it("Can delete pages", async(() => {
        ipcMain.on("pages:delete", (event: IpcMainEvent, pageIdToDelete: number) => {
            expect(pageIdToDelete).toEqual(ExpectedPageId);

        });

        service.deletePage(ExpectedPageId);
    }));

    it("When deleting an existing page Then the page list is updated", fakeAsync(() => {
        let updated = false;
        ipcMain.on("pages:delete", (event: IpcMainEvent) => {
            event.sender.send("pages:delete", true);
        });

        ipcMain.once("pages:get", () => {
            updated = true;
        });

        service.deletePage(ExpectedPageId);
        tick();

        expect(updated).toBeTruthy();
    }));

    it("When trying to delete a non existing page Then an error is logged", fakeAsync(() => {
        const logErrorSpy = spyOn(logger, "error");
        ipcMain.on("pages:delete", (event: IpcMainEvent) => {
            event.sender.send("pages:delete", false);
        });

        service.deletePage(99);
        tick();

        expect(logErrorSpy).toHaveBeenCalled();
    }));

    it("Can delete devices", async(() => {
        ipcMain.on("devices:delete", (event: IpcMainEvent, deviceIdToDelete: number) => {
            expect(deviceIdToDelete).toEqual(ExpectedDeviceId);
        });

        service.deleteDevice(ExpectedDeviceId);
    }));

    it("When deleting an existing device Then the devices list is updated", fakeAsync(() => {
        let updated = false;
        ipcMain.on("devices:delete", (event: IpcMainEvent) => {
            event.sender.send("devices:delete", true);
        });

        ipcMain.once("devices:get", () => {
            updated = true;
        });

        service.deleteDevice(ExpectedDeviceId);
        tick();

        expect(updated).toBeTruthy();
    }));

    it("When trying to delete a non existing device Then an error is logged", fakeAsync(() => {
        const logErrorSpy = spyOn(logger, "error");
        ipcMain.on("devices:delete", (event: IpcMainEvent) => {
            event.sender.send("devices:delete", false);
        });

        service.deleteDevice(99);
        tick();

        expect(logErrorSpy).toHaveBeenCalled();
    }));

    it("Can update devices", async(() => {
        const expectedNewDevicename = "new name";

        ipcMain.on("devices:update", (event: IpcMainEvent, updateParams: IUpdateDeviceParams) => {
            expect(updateParams.id).toEqual(ExpectedDeviceId);
            expect(updateParams.newValue).toEqual(expectedNewDevicename);
        });

        service.updateDeviceName(ExpectedDeviceId, expectedNewDevicename);
    }));

    it("When updating an existing device Then the devices list is updated", fakeAsync(() => {
        let updated = false;
        ipcMain.on("devices:update", (event: IpcMainEvent) => {
            event.sender.send("devices:update", true);
        });

        ipcMain.once("devices:get", () => {
            updated = true;
        });

        service.updateDeviceName(ExpectedDeviceId, "any");
        tick();

        expect(updated).toBeTruthy();
    }));

    it("When trying to update a non existing device Then an error is logged", fakeAsync(() => {
        const logErrorSpy = spyOn(logger, "error");
        ipcMain.on("devices:update", (event: IpcMainEvent) => {
            event.sender.send("devices:update", false);
        });

        service.updateDeviceName(99, "any");
        tick();

        expect(logErrorSpy).toHaveBeenCalled();
    }));

    it("Can update pages", async(() => {
        const expectedPageNewvalue = "new value";
        const pageList = [ 1, 2, 3, 4 ];
        const pageField = PageFields.PageSize;

        ipcMain.on("pages:update", (event: IpcMainEvent, field: string, updateParams: IUpdateParams) => {
            expect(field).toEqual(field);
            expect(updateParams.pages).toEqual(pageList);
            expect(updateParams.newValue).toEqual(expectedPageNewvalue);
        });

        service.updatePageField(pageField, pageList, expectedPageNewvalue);
    }));

    it("When updating an existing pages Then the page list is updated", fakeAsync(() => {
        let updated = false;
        ipcMain.on("pages:update", (event: IpcMainEvent) => {
            event.sender.send("pages:update", true);
        });

        ipcMain.once("pages:get", () => {
            updated = true;
        });

        service.updatePageField(PageFields.Destination, [ 1 ], "any");
        tick();

        expect(updated).toBeTruthy();
    }));

    it("When trying to update a non existing page Then an error is logged", fakeAsync(() => {
        const logErrorSpy = spyOn(logger, "error");
        ipcMain.on("pages:update", (event: IpcMainEvent) => {
            event.sender.send("pages:update", false);
        });

        service.updatePageField(PageFields.Destination, [ 99 ], "any");
        tick();

        expect(logErrorSpy).toHaveBeenCalled();
    }));
});
