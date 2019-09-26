import { Component, DebugElement, EventEmitter, Input, Output } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { StateService } from "@uirouter/angular";
import { of, Subject } from "rxjs";
import { configureTestSuite } from "../../../../test/configureTestSuite";
import { IDevice } from "../../../common/rest";
import { ApplicationService } from "../Services/application.service";
import { DataService } from "../Services/data.service";
import { DataServiceMock } from "../Services/data.service.mock";
import { LogService } from "../Services/log.service";
import { ModalManagerService } from "../UiLib";
import { ELanguages, EModals, IDeviceSelection, ILanguageParam, IMessageParam } from "./definitions";
import { LocalizationService } from "./localization.service";
import { LocalizationServiceMock } from "./localization.service.mock";
import { MainPageComponent } from "./main-page.component";

// tslint:disable: max-classes-per-file
@Component({ selector: "toolbar", template: ``})
class ToolFakeBarComponent {
    @Input() public editingDevices: boolean;
    @Output() public onAddDevice = new EventEmitter<any>();
    @Output() public onEditDevices = new EventEmitter<any>();
    @Output() public onEditPages = new EventEmitter<any>();
    @Output() public onSettings = new EventEmitter<any>();
    @Output() public onClose = new EventEmitter<any>();

    public addDevice() {
        this.onAddDevice.emit();
    }
    public editDevice() {
        this.onEditDevices.emit();
    }
    public editPages() {
        this.onEditPages.emit();
    }
    public settings() {
        this.onSettings.emit();
    }
    public close() {
        this.onClose.emit();
    }
}
@Component({ selector: "device-panel", template: ``})
class DevicePanelFakeComponent {
    @Input() public devices: IDevice[];
    @Input() public selectedDeviceId: number;
    @Output() public onDeleteDevice = new EventEmitter<number>();
    @Output() public onSelectedDevice = new EventEmitter<number>();

    public deleteDevice(id: number) {
        this.onDeleteDevice.emit(id);
    }
    public selectDevice(id: number) {
        this.onSelectedDevice.emit(id);
    }
}
@Component({ selector: "ui-view", template: ``})
class UiViewFakeComponent {}
// tslint:disable-next-line: no-empty
function NOOP() {}

describe("Given a main page component", () => {

    configureTestSuite();

    const devices: IDevice[] = [
        {
            id: 1,
            name: "Device 1"
        },
        {
            id: 2,
            name: "Device 2"
        },
        {
            id: 3,
            name: "Device 3"
        }
    ];
    const languageObservable: Subject<any> = new Subject<any>();

    let fixture: ComponentFixture<MainPageComponent>;
    let element: DebugElement;
    let component: MainPageComponent;
    let toolbar: ToolFakeBarComponent;
    let devicePanel: DevicePanelFakeComponent;
    let goSpy: jasmine.Spy;
    let setLanguageSpy: jasmine.Spy;
    let deviceNameSpy: jasmine.Spy;
    let addNewDeviceSpy: jasmine.Spy;
    let deleteDeviceMessageSpy: jasmine.Spy;
    let modalPushSpy: jasmine.Spy;
    let deleteDeviceSpy: jasmine.Spy;
    let closeMessageSpy: jasmine.Spy;
    let closeSpy: jasmine.Spy;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                MainPageComponent,
                ToolFakeBarComponent,
                DevicePanelFakeComponent,
                UiViewFakeComponent
            ],
            providers: [
                { provide: LogService, useValue: { info: NOOP }},
                { provide: ApplicationService, useValue: { close: NOOP }},
                { provide: StateService, useValue: { go: NOOP }},
                { provide: DataService, useClass: DataServiceMock },
                { provide: ModalManagerService, useValue: { push: NOOP }},
                { provide: LocalizationService, useClass: LocalizationServiceMock }
            ]
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(MainPageComponent);
        element = fixture.debugElement;
        component = fixture.componentInstance;
        const devicePanelElement = element.query(By.directive(DevicePanelFakeComponent));
        devicePanel = devicePanelElement.componentInstance as DevicePanelFakeComponent;
        const toolbarElememt = element.query(By.directive(ToolFakeBarComponent));
        toolbar = toolbarElememt.componentInstance as ToolFakeBarComponent;
    });

    beforeEach(() => {
        const stateService: StateService = TestBed.get(StateService);
        goSpy = spyOn(stateService, "go");
        const dataService: DataService = TestBed.get(DataService);
        spyOnProperty(dataService, "devices", "get").and.returnValue(devices);
        addNewDeviceSpy = spyOn(dataService, "addNewDevice");
        deleteDeviceSpy = spyOn(dataService, "deleteDevice");
        component.selectedDeviceId = devices[0].id;
        const localizationService: LocalizationService = TestBed.get(LocalizationService);
        setLanguageSpy = spyOn(localizationService, "setLanguage");
        deviceNameSpy = spyOnProperty(localizationService, "deviceName", "get");
        deleteDeviceMessageSpy = spyOnProperty(localizationService, "deleteDeviceMessage", "get");
        closeMessageSpy = spyOnProperty(localizationService, "closeMessage", "get");
        spyOnProperty(localizationService, "language$", "get").and.returnValue(languageObservable);
        const modalManagerService: ModalManagerService = TestBed.get(ModalManagerService);
        modalPushSpy = spyOn(modalManagerService, "push");
        const applicationService: ApplicationService = TestBed.get(ApplicationService);
        closeSpy = spyOn(applicationService, "close");

        fixture.detectChanges();
        languageObservable.next();
    });

    it("When it is initialized Then the html is defined", () => {
        expect(element.nativeElement).toBeTruthy();
        expect(devicePanel).toBeTruthy();
        expect(toolbar).toBeTruthy();
    });

    it("When is inititialized Then the device panel gets the existing devices", () => {
        expect(devicePanel.devices).toEqual(devices);
    });

    it("When it is initialized Then it goes to the pages edition", () => {
        const expectedDeviceSelection: IDeviceSelection = { deviceId: component.selectedDeviceId };

        expect(goSpy).toHaveBeenCalledWith("pages", expectedDeviceSelection);
    });

    it("When it is initialized Then it sets the default language", () => {
        expect(setLanguageSpy).toHaveBeenCalledWith(ELanguages.English);
    });

    it("When calling edit devices Then the view changes to the device edition", () => {
        component.selectedDeviceId = devices[0].id;
        fixture.detectChanges();
        const expectedDeviceSelection: IDeviceSelection = { deviceId: component.selectedDeviceId };

        toolbar.editDevice();
        fixture.detectChanges();

        expect(toolbar.editingDevices).toBeTruthy();
        expect(goSpy).toHaveBeenCalledWith("device", expectedDeviceSelection);
    });

    it("When calling edit pages Then the view changes to the pages edition", () => {
        component.selectedDeviceId = devices[0].id;
        fixture.detectChanges();
        const expectedDeviceSelection: IDeviceSelection = { deviceId: component.selectedDeviceId };

        toolbar.editPages();
        fixture.detectChanges();

        expect(component.editingDevices).toBeFalsy();
        expect(goSpy).toHaveBeenCalledWith("pages", expectedDeviceSelection);
    });

    it("When selecting device Then it is reflected by the associated property", () => {
        const ExpectedDeviceId = devices[1].id;

        devicePanel.selectDevice(ExpectedDeviceId);
        fixture.detectChanges();

        expect(devicePanel.selectedDeviceId).toBe(ExpectedDeviceId);
    });

    it("When selecting device Then the view is adjusted with the selected device", () => {
        const ExpectedDeviceId =  devices[2].id;
        component.editingDevices = true;
        fixture.detectChanges();

        devicePanel.selectDevice(ExpectedDeviceId);
        fixture.detectChanges();

        const expectedDeviceSelection: IDeviceSelection = { deviceId: component.selectedDeviceId };
        expect(goSpy).toHaveBeenCalledWith("device", expectedDeviceSelection);
    });

    it("When adding a device Then the data service is called with thee localized name", () => {
        const expectedName = "DEVICE";
        deviceNameSpy.and.returnValue(of(expectedName));

        toolbar.addDevice();

        expect(addNewDeviceSpy).toHaveBeenCalledWith(expectedName);
    });

    it("When deleting a device Then a dialog is open", () => {
        const deleteMessage = "Delete Device";
        deleteDeviceMessageSpy.and.returnValue(of(deleteMessage));
        const expectedDialogMessage: IMessageParam = { message: `${deleteMessage}: ${devices[0].name}` };
        modalPushSpy.and.returnValue(of({}));

        devicePanel.deleteDevice(devices[0].id);

        expect(modalPushSpy).toHaveBeenCalledWith(EModals.Confimation, expectedDialogMessage);
    });

    it("When deleting a device dialog is confirmed Then the device is deleted", () => {
        deleteDeviceMessageSpy.and.returnValue(of(""));
        modalPushSpy.and.returnValue(of({}));

        devicePanel.deleteDevice(devices[0].id);

        expect(deleteDeviceSpy).toHaveBeenCalledWith(devices[0].id);
    });

    it("When deleting a device dialog is not confirmed Then the device is not deleted", () => {
        deleteDeviceMessageSpy.and.returnValue(of(""));
        const observableMock = new Subject<any>();
        modalPushSpy.and.returnValue(observableMock);

        devicePanel.deleteDevice(devices[0].id);
        observableMock.error({});
        fixture.detectChanges();

        expect(deleteDeviceSpy).not.toHaveBeenCalled();
    });

    it("When calling settings Then the settings dialog is open", () => {
        modalPushSpy.and.returnValue(of({}));

        toolbar.settings();

        expect(modalPushSpy).toHaveBeenCalledWith(
            EModals.Settings,
            { language: ELanguages.English } as ILanguageParam);
    });

    it("When calling settings is applied Then the settings dialog returns application settings to be applied", () => {
        const observableMock = new Subject<any>();
        modalPushSpy.and.returnValue(observableMock);
        setLanguageSpy.calls.reset();

        toolbar.settings();
        observableMock.next(ELanguages.Klingon);
        fixture.detectChanges();

        expect(setLanguageSpy).toHaveBeenCalledWith(ELanguages.Klingon);
    });

    it("When calling settings is dismissed Then no settings are applied", () => {
        const observableMock = new Subject<any>();
        modalPushSpy.and.returnValue(observableMock);
        setLanguageSpy.calls.reset();

        toolbar.settings();
        observableMock.error({});
        fixture.detectChanges();

        expect(setLanguageSpy).not.toHaveBeenCalled();
    });

    it("When calling close Then the close confirmation dialog is open", () => {
        modalPushSpy.and.returnValue(of({}));
        const closeMessage = "Close Application";
        closeMessageSpy.and.returnValue(of(closeMessage));
        const expectedDialogMessage: IMessageParam = { message: closeMessage };

        toolbar.close();

        expect(modalPushSpy).toHaveBeenCalledWith(EModals.Confimation, expectedDialogMessage);
    });

    it("When closing app is confirmed then the application is closed", () => {
        modalPushSpy.and.returnValue(of({}));
        closeMessageSpy.and.returnValue(of(""));

        toolbar.close();

        expect(closeSpy).toHaveBeenCalled();
    });

    it("When closing app is not confirmed then the application is not closed", () => {
        const observableMock = new Subject<any>();
        modalPushSpy.and.returnValue(observableMock);
        closeMessageSpy.and.returnValue(of(""));

        toolbar.close();
        observableMock.error({});
        fixture.detectChanges();

        expect(closeSpy).not.toHaveBeenCalled();
    });
});
