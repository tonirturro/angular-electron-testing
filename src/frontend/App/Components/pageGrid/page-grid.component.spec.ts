import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { of, Subject } from "rxjs";
import { configureTestSuite } from "../../../../../test/configureTestSuite";
import { PageFields } from "../../../../common/model";
import { ISelectableOption } from "../../../../common/rest";
import { DataService } from "../../Services/data.service";
import { DataServiceMock } from "../../Services/data.service.mock";
import { NgbTooltipDirective } from "../../UiLib";
import { ILocalizationService } from "../definitions";
import { LocalizationService } from "../localization.service";
import { LocalizationServiceMock } from "../localization.service.mock";
import { PageGridComponent } from "./page-grid.component";

describe("Given a page grid component", () => {

    configureTestSuite();

    const fakeMouseEvent: any = {
        ctrlKey: false,
        srcElement: {
            attributes: {
                getNamedItem: () => false
            }
        }
    };
    const capabilities: ISelectableOption[] = [
        {
            label: "capabilityLabel",
            value: "0"
        }
    ];
    const selectedPage: any = {
        id: 1
    };
    const NewValue = "1";
    let fixture: ComponentFixture<PageGridComponent>;
    let element: Element;
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
        const dataService = TestBed.get(DataService);
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
        element = fixture.nativeElement;
        component = fixture.componentInstance;
        fixture.detectChanges();
        component.selectPage(fakeMouseEvent, selectedPage.id );
    });

    afterAll(() => {
        NgbTooltipDirective.nextId = 0;
    });

    it("When created Then it has the html defined", () => {
        expect(element.innerHTML).toBeDefined();
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

    it("When changing page size Then the corresponding update model call is made", () => {
        component.updatePageSize(NewValue);

        expect(updatePageMock)
            .toHaveBeenCalledWith(PageFields.PageSize, [selectedPage.id], NewValue);
    });

    it("When changing print quality Then the corresponding update model call is made", () => {
        component.updatePrintQuality(NewValue);

        expect(updatePageMock)
            .toHaveBeenCalledWith(PageFields.PrintQuality, [ selectedPage.id ], NewValue);
    });

    it("When changing media type Then the corresponding update model call is made", () => {
        component.updateMediaType(NewValue);

        expect(updatePageMock)
            .toHaveBeenCalledWith(PageFields.MediaType, [ selectedPage.id ], NewValue);
    });

    it("When changing destination Then the corresponding update model call is made", () => {
        component.updateDestination(NewValue);

        expect(updatePageMock)
            .toHaveBeenCalledWith(PageFields.Destination, [ selectedPage.id ], NewValue);
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
