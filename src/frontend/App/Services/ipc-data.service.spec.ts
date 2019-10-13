import { fakeAsync, tick } from "@angular/core/testing";
import { IpcMain, IpcMainEvent, IpcRenderer } from "electron";
import * as ipcMock from "electron-ipc-mock";
import { IPage } from "../../../common/rest";
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

    it("When the pages are not yet fetched it sould retrive an empty array", () => {
        expect(service.pages.length).toEqual(0);
    });

    it("When the pages are fetched it should be retrieved", fakeAsync(() => {
        ipcMain.once("pages:get", (event: IpcMainEvent) => {
            event.sender.send("pages:get", expectedPages);
        });

        const initialPages = service.pages;
        tick();
        const finalPages = service.pages;

        expect(initialPages.length).toEqual(0);
        expect(finalPages).toEqual(expectedPages);
    }));
});
