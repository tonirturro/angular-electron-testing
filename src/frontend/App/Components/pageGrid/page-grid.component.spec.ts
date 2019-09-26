import { DebugElement } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { By } from "@angular/platform-browser";
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { of, Subject } from "rxjs";
import { configureTestSuite } from "../../../../../test/configureTestSuite";
import { PageFields } from "../../../../common/model";
import { IPage, ISelectableOption } from "../../../../common/rest";
import { DataService } from "../../Services/data.service";
import { DataServiceMock } from "../../Services/data.service.mock";
import { NgbTooltipDirective } from "../../UiLib";
import { ILocalizationService } from "../definitions";
import { LocalizationService } from "../localization.service";
import { LocalizationServiceMock } from "../localization.service.mock";
import { PageGridComponent } from "./page-grid.component";

describe("Given a page grid component", () => {

    configureTestSuite();

    const DeviceId = 1;
    const pages: IPage[] = [
        { id: 1, deviceId: DeviceId, pageSize: "A0", printQuality: "Fast", mediaType: "Plain", destination: "Basket" },
        { id: 2, deviceId: DeviceId, pageSize: "A0", printQuality: "Fast", mediaType: "Plain", destination: "Basket" },
        { id: 3, deviceId: DeviceId, pageSize: "A0", printQuality: "Fast", mediaType: "Plain", destination: "Basket" },
        { id: 4, deviceId: DeviceId, pageSize: "A0", printQuality: "Fast", mediaType: "Plain", destination: "Basket" }
    ];
    const capabilities: ISelectableOption[] = [
        {
            label: "capabilityLabel",
            value: "0"
        }
    ];
    const NewValue = "1";
    let fixture: ComponentFixture<PageGridComponent>;
    let element: DebugElement;
    let pageElements: DebugElement[];
    let component: PageGridComponent;
    let localizationService: ILocalizationService;
    let updatePageMock: jasmine.Spy;
    let getLocalizedCapabilityMock: jasmine.Spy;
    let getCapabilitiesMock: jasmine.Spy;

    beforeAll(() => {
        TestBed.configureTestingModule({
            declarations: [PageGridComponent, NgbTooltipDirective ],
            imports: [
                FormsModule,
                TranslateModule.forRoot({
                    loader: { provide: TranslateLoader, useClass: TranslateFakeLoader }
                })
            ],
            providers: [
                { provide: LocalizationService, useClass: LocalizationServiceMock },
                { provide: DataService, useClass: DataServiceMock }
            ],
        });
    });

    beforeEach(() => {
        const dataService = TestBed.get(DataService) as DataService;
        spyOnProperty(dataService, "pages").and.returnValue(pages);
        updatePageMock = spyOn(dataService, "updatePageField");
        getCapabilitiesMock = spyOn(dataService, "getCapabilities");
        getCapabilitiesMock.and.returnValue(of(capabilities));
        localizationService = TestBed.get(LocalizationService);
        spyOnProperty(localizationService, "language$", "get").and.returnValue(new Subject<any>());
        getLocalizedCapabilityMock = spyOn(localizationService, "getLocalizedCapability");
        getLocalizedCapabilityMock.and.returnValue(of({}));
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PageGridComponent);
        element = fixture.debugElement;
        component = fixture.componentInstance;
        component.selectedDeviceId = DeviceId.toString();
        fixture.detectChanges();
        pageElements = element.queryAll(By.css("#page"));
    });

    afterAll(() => {
        NgbTooltipDirective.nextId = 0;
    });

    it("When created Then it has the html defined", () => {
        expect((element.nativeElement as Element).innerHTML).toBeTruthy();
    });

    it("When the component has been initialized Then it observes localization changes", () => {
        expect((localizationService.language$ as Subject<any>).observers.length).toEqual(1);
    });

    it("When the component has been initialized " +
        "Then the localization service is called for each one of the capabilites", () => {
            expect(getCapabilitiesMock).toHaveBeenCalledWith(PageFields.PrintQuality);
            expect(getCapabilitiesMock).toHaveBeenCalledWith(PageFields.MediaType);
            expect(getCapabilitiesMock).toHaveBeenCalledWith(PageFields.Destination);
            expect(getLocalizedCapabilityMock).toHaveBeenCalledWith(capabilities[0]);
            expect(getLocalizedCapabilityMock).toHaveBeenCalledTimes(3);
    });

    it("When the component has been initialized Then it displays the pages from the model", () => {
        expect(pageElements.length).toEqual(pages.length);
    });

    it("When changing page size Then the corresponding update model call is made", () => {
        (pageElements[0].nativeElement as HTMLElement).click();

        component.updatePageSize(NewValue);

        expect(updatePageMock)
            .toHaveBeenCalledWith(PageFields.PageSize, [ pages[0].id ], NewValue);
    });

    it("When changing print quality Then the corresponding update model call is made", () => {
        (pageElements[0].nativeElement as HTMLElement).click();

        component.updatePrintQuality(NewValue);

        expect(updatePageMock)
            .toHaveBeenCalledWith(PageFields.PrintQuality, [ pages[0].id ], NewValue);
    });

    it("When changing media type Then the corresponding update model call is made", () => {
        (pageElements[0].nativeElement as HTMLElement).click();

        component.updateMediaType(NewValue);

        expect(updatePageMock)
            .toHaveBeenCalledWith(PageFields.MediaType, [ pages[0].id ], NewValue);
    });

    it("When changing destination Then the corresponding update model call is made", () => {
        (pageElements[0].nativeElement as HTMLElement).click();

        component.updateDestination(NewValue);

        expect(updatePageMock)
            .toHaveBeenCalledWith(PageFields.Destination, [ pages[0].id ], NewValue);
    });

    it("When changing language Then the capabilities are updated", () => {
        getCapabilitiesMock.calls.reset();
        getLocalizedCapabilityMock.calls.reset();

        (localizationService.language$ as Subject<any>).next();

        expect(getCapabilitiesMock).toHaveBeenCalledWith(PageFields.PrintQuality);
        expect(getCapabilitiesMock).toHaveBeenCalledWith(PageFields.MediaType);
        expect(getCapabilitiesMock).toHaveBeenCalledWith(PageFields.Destination);
        expect(getLocalizedCapabilityMock).toHaveBeenCalledWith(capabilities[0]);
        expect(getLocalizedCapabilityMock).toHaveBeenCalledTimes(3);
    });

    it("When the component is destroyed Then it unsubscipts from localization changes", () => {
        fixture.destroy();
        expect((localizationService.language$ as Subject<any>).observers.length).toEqual(0);
    });
});
