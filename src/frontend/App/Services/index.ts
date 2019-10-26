import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";

import { ApplicationService } from "./application.service";
import { DataService } from "./data.service";
import { ElectronService } from "./electron.service";
import { LogService } from "./log.service";

@NgModule({
    imports: [
        HttpClientModule,
     ],
    providers: [
        ApplicationService,
        ElectronService,
        DataService,
        LogService
    ]
})
export class AppServicesModule {}
