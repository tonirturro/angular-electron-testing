import { Observable } from "rxjs";
import { ISelectableOption } from "../../../common/rest";

export enum EModals {
    Confimation = "confirmation",
    Settings = "settings"
}

export enum ELanguages {
    English,
    Klingon
}

export interface IDialogParam<T> {
    params: T;
}

export interface IMessageParam {
    message: string;
}

export interface ILanguageParam {
    language: ELanguages;
}

export interface IDeviceSelection {
    deviceId: number;
}

export interface ILocalizationService {
    language$: Observable<any>;
    closeMessage: Observable<string>;
    deviceName: Observable<string>;
    deleteDeviceMessage: Observable<string>;
    setLanguage(language: ELanguages);
    getLocalizedCapability(capability: ISelectableOption): Observable<ISelectableOption>;
}
