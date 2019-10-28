import { IpcMain, IpcMainEvent } from "electron";
import { PageFields } from "../../common/model";
import { INewDeviceParams, IUpdateDeviceParams, IUpdateParams } from "../../common/rest";
import { Capabilities } from "../Repository/Capabilities";
import { Data } from "../Repository/Data";

export class Api {
  constructor(
    ipcMain: IpcMain,
    data: Data,
    capabilities: Capabilities) {

    // Access to the pages repository
    ipcMain.on("pages:get", (event: IpcMainEvent, deviceId: number) => {
      event.sender.send("pages:get", data.getPages());
    });

    ipcMain.on("pages:add", (event: IpcMainEvent, deviceId: number) => {
      data.newPage(deviceId);
      event.sender.send("pages:add", true);
    });

    ipcMain.on("pages:delete", (event: IpcMainEvent, pageIdToDelete: number) => {
      event.sender.send("pages:delete", data.deletePage(pageIdToDelete));
    });

    ipcMain.on("pages:update", (event: IpcMainEvent, field: PageFields, updateParams: IUpdateParams ) => {
      let result = true;
      updateParams.pages.forEach((page) => {
        result = result && this.updatePage(page, field, data, updateParams.newValue);
      });
      event.sender.send("pages:update", result);
    });

    // Access to the devices repository
    ipcMain.on("devices:get", (event: IpcMainEvent, newDevice: INewDeviceParams) => {
      event.sender.send("devices:get", data.getDevices());
    });

    ipcMain.on("devices:add", (event: IpcMainEvent, newDevice: INewDeviceParams) => {
      data.newDevice(newDevice.name);
      event.sender.send("devices:add", true);
    });

    ipcMain.on("devices:delete", (event: IpcMainEvent, deviceIdToDelete: number) => {
      event.sender.send("devices:delete", data.deleteDevice(deviceIdToDelete));
    });

    ipcMain.on(`devices:capabilities:${PageFields.PageSize}`, (event: IpcMainEvent) => {
      event.sender.send(
        `devices:capabilities:${PageFields.PageSize}`,
        capabilities.getCapabilities(PageFields.PageSize));
    });

    ipcMain.on(`devices:capabilities:${PageFields.PrintQuality}`, (event: IpcMainEvent) => {
      event.sender.send(
        `devices:capabilities:${PageFields.PrintQuality}`,
        capabilities.getCapabilities(PageFields.PrintQuality));
    });

    ipcMain.on(`devices:capabilities:${PageFields.MediaType}`, (event: IpcMainEvent) => {
      event.sender.send(
        `devices:capabilities:${PageFields.MediaType}`,
        capabilities.getCapabilities(PageFields.MediaType));
    });

    ipcMain.on(`devices:capabilities:${PageFields.Destination}`, (event: IpcMainEvent) => {
      event.sender.send(
        `devices:capabilities:${PageFields.Destination}`,
        capabilities.getCapabilities(PageFields.Destination));
    });

    ipcMain.on("devices:update", (event: IpcMainEvent, updateParams: IUpdateDeviceParams) => {
      event.sender.send(
        "devices:update",
        data.updateDeviceName(updateParams.id, updateParams.newValue));
    });
  }

  private updatePage(page: number, field: PageFields, data: Data, newValue: string): boolean {
    switch (field) {
      case PageFields.PageSize:
        return data.updatePageSize(page, newValue);
      case PageFields.PrintQuality:
        return data.updatePrintQuality(page, newValue);
      case PageFields.MediaType:
        return data.updateMediaType(page, newValue);
      case PageFields.Destination:
        return data.updateDestination(page, newValue);
    }

    return false;
  }
}
