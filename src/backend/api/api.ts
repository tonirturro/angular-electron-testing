import { IpcMain, IpcMainEvent } from "electron";
import { Data } from "../Repository/Data";
export class Api {
    constructor(
        ipcMain: IpcMain,
        data: Data ) {

        // Access to the pages repository
        ipcMain.on("pages", (event: IpcMainEvent) => {
            event.sender.send("pages", data.getPages());
        });
    }
}
