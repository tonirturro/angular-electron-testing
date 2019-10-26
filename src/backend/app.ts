import * as bodyParser from "body-parser";
import * as express from "express";
import * as path from "path";

import { ipcMain } from "electron";

import { Api } from "./api/api";
import { Capabilities } from "./Repository/Capabilities";
import { Data } from "./Repository/Data";
import { RestRouter } from "./Routes/REST";

const app = express();

const root = "dist";

// Resolve dependencies
const data = new Data();
const capabilities = new Capabilities();
const restApi = new RestRouter(data, capabilities).Router;
const backendApi = new Api(ipcMain, data, capabilities);

// Initialize app
app.use(express.static(path.resolve(root)));
app.use(bodyParser.json());

app.use("/REST", restApi);

export const main = {
    api: backendApi,
    application: app,
    dependencies : {
        capabilitiesLayer: capabilities,
        dataLayer : data
    } };
