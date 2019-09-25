import { Observable, of } from "rxjs";
import { ISelectableOption } from "../../../common/rest";
import { ELanguages, ILocalizationService } from "./definitions";

export class LocalizationServiceMock implements ILocalizationService {
    public get language$(): Observable<any> {
        return of();
    }
    public get closeMessage(): Observable<string> {
        return of("");
    }
    public get deviceName(): Observable<string> {
        return of("");
    }
    public get deleteDeviceMessage(): Observable<string> {
        return of("");
    }
    // tslint:disable: no-empty
    public setLanguage(language: ELanguages) {}
    public getLocalizedCapability(capability: ISelectableOption): Observable<ISelectableOption> {
        return of({ value: "", label: ""});
    }
}
