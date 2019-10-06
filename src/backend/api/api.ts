import { IpcMain, IpcRenderer } from "electron";
import { Data } from "../Repository/Data";
export class Api {
    constructor(
        ipcMain: IpcMain,
        ipcRendered: IpcRenderer,
        data: Data ) {

        // Access to the pages repository
        ipcMain.on("pages", () => {
            ipcRendered.send("pages", data.getPages());
        });
    }
}
