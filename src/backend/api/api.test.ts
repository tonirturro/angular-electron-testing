import { expect } from "chai";
import { IpcRenderer, IpcRendererEvent } from "electron";
import * as ipcMock from "electron-ipc-mock";
import { fake, replace, spy, stub } from "sinon";
import { PageFields } from "../../common/model";
import {
    IDevice,
    INewDeviceParams,
    IPage,
    ISelectableOption,
    IUpdateDeviceParams,
    IUpdateParams } from "../../common/rest";
import { Capabilities } from "../Repository/Capabilities";
import { Data } from "../Repository/Data";
import { Api } from "./api";

describe("Given an API", () => {

    const expectedPages: IPage[] = [
        { id: 1, pageSize: "A4", mediaType: "plain", printQuality: "fast", destination: "basket", deviceId: 1 },
        { id: 2, pageSize: "A2", mediaType: "plain", printQuality: "fast", destination: "basket", deviceId: 2 }
    ];
    const expectedDevices: IDevice[] = [
        { id: 1, name: "Device 1" },
        { id: 2, name: "Device 2" }
    ];
    let api: Api;
    let data: Data;
    let ipcRenderer: IpcRenderer;
    let capabilities: Capabilities;

    beforeEach(() => {
        const mock = ipcMock();
        capabilities  = new Capabilities();
        ipcRenderer = mock.ipcRenderer;
        data = new Data();
        api = new Api(mock.ipcMain, data, capabilities);
    });

    it("Should return the existing pages", (done) => {
        stub(data, "getPages").returns(expectedPages);
        ipcRenderer.once("pages:get", (event: IpcRendererEvent, pages: IPage[]) => {
            expect(pages).equals(expectedPages);
            done();
        });

        ipcRenderer.send("pages:get");
    });

    it("Should return the existing devices", (done) => {
        stub(data, "getDevices").returns(expectedDevices);
        ipcRenderer.once("devices:get", (event: IpcRendererEvent, devices: IDevice[]) => {
            expect(devices).equals(expectedDevices);
            done();
        });

        ipcRenderer.send("devices:get");
    });

    it("Should add new pages", (done) => {
        const expectedDeviceId = 2;
        const newPageSpy = spy(data, "newPage");
        ipcRenderer.once("pages:add", (event: IpcRendererEvent, response: boolean) => {
            expect(newPageSpy.calledOnce).to.equal(true);
            expect(newPageSpy.calledWith(expectedDeviceId)).to.equal(true);
            expect(response).to.equal(true);
            done();
        });

        ipcRenderer.send("pages:add", expectedDeviceId);
    });

    it("Should add new devices", (done) => {
        const newDeviceParams: INewDeviceParams = {
            name: "any"
        };
        const newDeviceSpy = spy(data, "newDevice");
        ipcRenderer.once("devices:add", (event: IpcRendererEvent, response: boolean) => {
            expect(newDeviceSpy.calledOnce).to.equal(true);
            expect(newDeviceSpy.calledWith(newDeviceParams.name)).to.equal(true);
            expect(response).to.equal(true);
            done();
        });

        ipcRenderer.send("devices:add", newDeviceParams);
    });

    it("Should get device capabilities", (done) => {
        const capabilityToRequest = PageFields.PageSize;
        ipcRenderer.once(
            "devices:capabilities",
            (event: IpcRendererEvent, selectedCapabilities: ISelectableOption[]) => {
                expect(selectedCapabilities).equals(capabilities.getCapabilities(capabilityToRequest));
                done();
            });

        ipcRenderer.send("devices:capabilities", capabilityToRequest);
    });

    it("When deleting a page and the page exists then the api returns true", (done) => {
        const pageIdToDelete = 4;
        const deletePageFake = fake.returns(true);
        replace(data, "deletePage", deletePageFake);
        ipcRenderer.once("pages:delete", (event: IpcRendererEvent, response: boolean) => {
            expect(deletePageFake.calledOnce).to.equal(true);
            expect(deletePageFake.calledWith(pageIdToDelete)).to.equal(true);
            expect(response).to.equal(true);
            done();
        });

        ipcRenderer.send("pages:delete", pageIdToDelete);
    });

    it("When deleting a page and the page does not exist then the api returns false", (done) => {
        const pageIdToDelete = 1000;
        const deletePageFake = fake.returns(false);
        replace(data, "deletePage", deletePageFake);
        ipcRenderer.once("pages:delete", (event: IpcRendererEvent, response: boolean) => {
            expect(deletePageFake.calledOnce).to.equal(true);
            expect(deletePageFake.calledWith(pageIdToDelete)).to.equal(true);
            expect(response).to.equal(false);
            done();
        });

        ipcRenderer.send("pages:delete", pageIdToDelete);
    });

    it("When deleting a device and the device exists then the api returns true", (done) => {
        const deviceIdToDelete = 4;
        const deleteDeviceFake = fake.returns(true);
        replace(data, "deleteDevice", deleteDeviceFake);
        ipcRenderer.once("devices:delete", (event: IpcRendererEvent, response: boolean) => {
            expect(deleteDeviceFake.calledOnce).to.equal(true);
            expect(deleteDeviceFake.calledWith(deviceIdToDelete)).to.equal(true);
            expect(response).to.equal(true);
            done();
        });

        ipcRenderer.send("devices:delete", deviceIdToDelete);
    });

    it("When deleting a device and the device does not exist then the api returns false", (done) => {
        const deviceIdToDelete = 4;
        const deleteDeviceFake = fake.returns(false);
        replace(data, "deleteDevice", deleteDeviceFake);
        ipcRenderer.once("devices:delete", (event: IpcRendererEvent, response: boolean) => {
            expect(deleteDeviceFake.calledOnce).to.equal(true);
            expect(deleteDeviceFake.calledWith(deviceIdToDelete)).to.equal(true);
            expect(response).to.equal(false);
            done();
        });

        ipcRenderer.send("devices:delete", deviceIdToDelete);
    });

    it("When updating a device and the device exists then the api returns true", (done) => {
        const updateParams: IUpdateDeviceParams = {
            id: 4,
            newValue: "new one"
        };
        const ipdateDeviceFake = fake.returns(true);
        replace(data, "updateDeviceName", ipdateDeviceFake);
        ipcRenderer.once("devices:update", (event: IpcRendererEvent, response: boolean) => {
            expect(ipdateDeviceFake.calledOnce).to.equal(true);
            expect(ipdateDeviceFake.calledWith(updateParams.id, updateParams.newValue)).to.equal(true);
            expect(response).to.equal(true);
            done();
        });

        ipcRenderer.send("devices:update", updateParams);
    });

    it("When updating a device and the device does not exist then the api returns false", (done) => {
        const updateParams: IUpdateDeviceParams = {
            id: 1000,
            newValue: "don't care"
        };
        const ipdateDeviceFake = fake.returns(false);
        replace(data, "updateDeviceName", ipdateDeviceFake);
        ipcRenderer.once("devices:update", (event: IpcRendererEvent, response: boolean) => {
            expect(ipdateDeviceFake.calledOnce).to.equal(true);
            expect(ipdateDeviceFake.calledWith(updateParams.id, updateParams.newValue)).to.equal(true);
            expect(response).to.equal(false);
            done();
        });

        ipcRenderer.send("devices:update", updateParams);
    });

    it("When updating a page size and the pages exists then the api returns true", (done) => {
        const updateParams: IUpdateParams = {
            newValue: "new",
            pages: [ 1, 2, 3, 4]
        };
        const ipdatePageSizeFake = fake.returns(true);
        replace(data, "updatePageSize", ipdatePageSizeFake);
        ipcRenderer.once("pages:update", (event: IpcRendererEvent, response: boolean) => {
            expect(ipdatePageSizeFake.callCount).to.equal(updateParams.pages.length);
            updateParams.pages.forEach((page) => {
                expect(ipdatePageSizeFake.calledWith(page, updateParams.newValue)).to.equal(true);
            });
            expect(response).to.equal(true);
            done();
        });

        ipcRenderer.send("pages:update", PageFields.PageSize, updateParams);
    });
});
