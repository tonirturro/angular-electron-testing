import { app, BrowserWindow } from "electron";
import { main } from "../backend/app";

let mainWindow = null;
let backend = main;

/**
 * Quit the application if we are not in MacOS and all the windows are closed
 */
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        if (backend) {
            backend = null;
        }
        app.quit();
    }
});

app.on("ready", () => {
    mainWindow = new BrowserWindow({
        frame: false,
        height: 720,
        webPreferences: {
            nodeIntegration: true
        },
        width: 1280
     });
    const url = `file://${app.getAppPath()}/index.htm`;
    mainWindow.loadURL(url);
    mainWindow.on("closed", () => {
        mainWindow = null;
    });
});
