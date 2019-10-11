import { expect } from "chai";
import { IpcRendererEvent } from "electron";
import * as ipcMock from "electron-ipc-mock";
import { stub } from "sinon";
import { IPage } from "../../common/rest";
import { Data } from "../Repository/Data";
import { Api } from "./api";

describe("Given an API", () => {

    const { ipcRenderer, ipcMain } = ipcMock();

    const expectedPages: IPage[] = [
        { id: 1, pageSize: "A4", mediaType: "plain", printQuality: "fast", destination: "basket", deviceId: 1 },
        { id: 2, pageSize: "A2", mediaType: "plain", printQuality: "fast", destination: "basket", deviceId: 1 }
    ];
    let api: Api;
    let data: Data;

    beforeEach(() => {
        data = new Data();
        api = new Api(
            ipcMain,
            data
        );
    });

    it("Should return the existing pages", (done) => {
        stub(data, "getPages").returns(expectedPages);
        ipcRenderer.once("pages", (event: IpcRendererEvent, pages: IPage[]) => {
            expect(pages).equals(expectedPages);
            done();
        });

        ipcRenderer.send("pages");
    });
});
