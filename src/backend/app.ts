import { ipcMain } from "electron";

import { Api } from "./api/api";
import { Capabilities } from "./Repository/Capabilities";
import { Data } from "./Repository/Data";

// Resolve dependencies
const data = new Data();
const capabilities = new Capabilities();
const backendApi = new Api(ipcMain, data, capabilities);

export const main = backendApi;
