import { fakeAsync, tick } from "@angular/core/testing";
import { IpcMain, IpcMainEvent, IpcRenderer } from "electron";
import * as ipcMock from "electron-ipc-mock";
import { PageFields } from "../../../common/model";
import { IDevice, IPage, ISelectableOption } from "../../../common/rest";
import { DataService } from "./ipc-data.service";

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
    let service: DataService;
    let ipcMain: IpcMain;
    let ipcRenderer: IpcRenderer;

    beforeEach(() => {
        const mock = ipcMock();
        ipcMain = mock.ipcMain;
        ipcRenderer = mock.ipcRenderer;
    });

    beforeEach(() => {
        service = new DataService(ipcRenderer);
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

    it("Can read device page options", fakeAsync((done) => {
        ipcMain.once("devices:capabilities", (event: IpcMainEvent) => {
            event.sender.send("devices:capabilities", devicePageOptionsResponse);
        });

        service.getCapabilities(PageFields.PageSize).subscribe((capabilities) => {
            expect(capabilities).toEqual(devicePageOptionsResponse);
            done();
        });

        tick();
    }));

    it("Can cache device page options", fakeAsync((done) => {
        ipcMain.once("devices:capabilities", (event: IpcMainEvent) => {
            event.sender.send("devices:capabilities", devicePageOptionsResponse);
        });

        service.getCapabilities(PageFields.PageSize).subscribe();

        tick();

        service.getCapabilities(PageFields.PageSize).subscribe((capabilities) => {
            expect(capabilities).toEqual(devicePageOptionsResponse);
            done();
        });
    }));

    it("Can add pages", (done) => {
        ipcMain.once("pages:add", (event: IpcMainEvent, deviceId: number) => {
            expect(deviceId).toEqual(ExpectedDeviceId);
            done();
        });

        service.addNewPage(ExpectedDeviceId);
    });
});
