import { DebugElement } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { By } from "@angular/platform-browser";
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { Observable, of, Subject } from "rxjs";
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
    // tslint:disable: object-literal-sort-keys
    const capabilities: ISelectableOption[] = [
        { label: "Option 1", value: "0" },
        { label: "Option 2", value: "1" },
        { label: "Option 3", value: "2" },
        { label: "Option 4", value: "3" }
    ];
    const pages: IPage[] = [
        {
            id: 1,
            deviceId: DeviceId,
            pageSize: capabilities[0].label,
            printQuality: capabilities[1].label,
            mediaType: capabilities[2].label,
            destination: capabilities[3].label
        },
        {
            id: 2,
            deviceId: DeviceId,
            pageSize: capabilities[3].label,
            printQuality: capabilities[2].label,
            mediaType: capabilities[1].label,
            destination: capabilities[0].label
        },
        {
            id: 3,
            deviceId: DeviceId,
            pageSize: capabilities[0].label,
            printQuality: capabilities[2].label,
            mediaType: capabilities[1].label,
            destination: capabilities[3].label
        }
    ];
    const LocalizedFields = 3;
    let fixture: ComponentFixture<PageGridComponent>;
    let element: DebugElement;
    let pageElements: DebugElement[];
    let component: PageGridComponent;
    let localizationService: ILocalizationService;
    let updatePageMock: jasmine.Spy;
    let getLocalizedCapabilityMock: jasmine.Spy;
    let getCapabilitiesMock: jasmine.Spy;
    let addPageMock: jasmine.Spy;
    let deletePageMock: jasmine.Spy;

    beforeAll(() => {
        TestBed.configureTestingModule({
            declarations: [PageGridComponent, NgbTooltipDirective],
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
        addPageMock = spyOn(dataService, "addNewPage");
        deletePageMock = spyOn(dataService, "deletePage");
        localizationService = TestBed.get(LocalizationService);
        spyOnProperty(localizationService, "language$", "get").and.returnValue(new Subject<any>());
        getLocalizedCapabilityMock = spyOn(localizationService, "getLocalizedCapability");
        getLocalizedCapabilityMock.and.callFake((capability: ISelectableOption): Observable<ISelectableOption> => of(
            {
                label: `Translated ${capability.label}`,
                value: capability.value
            }
        ));
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
            capabilities.forEach((capability) => {
                expect(getLocalizedCapabilityMock).toHaveBeenCalledWith(capability);
            });
            expect(getLocalizedCapabilityMock).toHaveBeenCalledTimes(capabilities.length * LocalizedFields);
        });

    it("When the component has been initialized Then it displays the pages from the model", () => {
        expect(pageElements.length).toEqual(pages.length);
    });

    it("When clicking on a page Then it is selected", () => {
        const page = pageElements[0].nativeElement as HTMLElement;

        page.click();
        fixture.detectChanges();

        expect(page.classList).toContain("item-selected");
    });

    it("When clicking on a page Then the previously selected is deselected", () => {
        const page1 = pageElements[0].nativeElement as HTMLElement;
        const page2 = pageElements[1].nativeElement as HTMLElement;

        page1.click();
        page2.click();
        fixture.detectChanges();

        expect(page1.classList).not.toContain("item-selected");
        expect(page2.classList).toContain("item-selected");
    });

    it("When clicking on a page while holding ctrl key Then the previously selected it keeps selected", () => {
        const page1 = pageElements[0].nativeElement as HTMLElement;
        const page2 = pageElements[1].nativeElement as HTMLElement;

        page1.click();
        const clickEvent = new MouseEvent("click", {
            ctrlKey: true
        });
        page2.dispatchEvent(clickEvent);
        fixture.detectChanges();

        expect(page1.classList).toContain("item-selected");
        expect(page2.classList).toContain("item-selected");
    });

    it("When clicking on a page previosly selected while holding ctrl key " +
        "Then the previously selected is deselected", () => {
            const page1 = pageElements[0].nativeElement as HTMLElement;
            const page2 = pageElements[1].nativeElement as HTMLElement;
            const page3 = pageElements[2].nativeElement as HTMLElement;

            page1.click();
            const clickEvent = new MouseEvent("click", {
                ctrlKey: true
            });
            page2.dispatchEvent(clickEvent);
            page3.dispatchEvent(clickEvent);
            page2.dispatchEvent(clickEvent);
            fixture.detectChanges();

            expect(page1.classList).toContain("item-selected");
            expect(page2.classList).not.toContain("item-selected");
            expect(page3.classList).toContain("item-selected");
        });

    it("When clicking on a page Then the previously selected are deselected", () => {
        const page1 = pageElements[0].nativeElement as HTMLElement;
        const page2 = pageElements[1].nativeElement as HTMLElement;
        const page3 = pageElements[2].nativeElement as HTMLElement;

        const clickEvent = new MouseEvent("click", {
            ctrlKey: true
        });
        page1.dispatchEvent(clickEvent);
        page2.dispatchEvent(clickEvent);
        page3.click();
        fixture.detectChanges();

        expect(page1.classList).not.toContain("item-selected");
        expect(page2.classList).not.toContain("item-selected");
        expect(page3.classList).toContain("item-selected");
    });

    it("When clicking on a selector Then the page is seleted but the previously selected are kept", () => {
        const page1 = pageElements[0].nativeElement as HTMLElement;
        const page2 = pageElements[1].nativeElement as HTMLElement;
        const page2Selector = pageElements[1].query(By.css("#pageSize")).nativeElement as HTMLSelectElement;

        page1.click();
        page2Selector.click();
        fixture.detectChanges();

        expect(page1.classList).toContain("item-selected");
        expect(page2.classList).toContain("item-selected");
    });

    it("When clicking on a selector and the page is already selected Then the page keeps seleted", () => {
        const page = pageElements[0].nativeElement as HTMLElement;
        const pageSelector = pageElements[0].query(By.css("#pageSize")).nativeElement as HTMLSelectElement;

        pageSelector.click();
        pageSelector.click();
        fixture.detectChanges();

        expect(page.classList).toContain("item-selected");
    });

    it("When clicking at the add button Then a new page is requested to the model", () => {
        const addPageButton = element.query(By.css("#addPage")).nativeElement as HTMLElement;

        addPageButton.click();

        expect(addPageMock).toHaveBeenCalled();
    });

    it("When clicking at the delete from a page Then this page is delete", () => {
        const deletePageButton = pageElements[1].query(By.css("#pageDelete")).nativeElement as HTMLElement;

        deletePageButton.click();

        expect(deletePageMock).toHaveBeenCalledWith(pages[1].id);
    });

    it("When changing page size Then the corresponding update model call is made", () => {
        const selectedOption = 3;
        const pageSizeSelector = pageElements[0].query(By.css("#pageSize")).nativeElement as HTMLSelectElement;

        pageSizeSelector.click();
        pageSizeSelector.value = pageSizeSelector.options[selectedOption].value;
        pageSizeSelector.dispatchEvent(new Event("change"));

        expect(updatePageMock)
            .toHaveBeenCalledWith(PageFields.PageSize, [pages[0].id], selectedOption.toString());
    });

    it("When changing print quality Then the corresponding update model call is made", () => {
        const selectedOption = 2;
        const printQualitySelector = pageElements[1].query(By.css("#printQuality")).nativeElement as HTMLSelectElement;

        printQualitySelector.click();
        printQualitySelector.value = printQualitySelector.options[selectedOption].value;
        printQualitySelector.dispatchEvent(new Event("change"));

        expect(updatePageMock)
            .toHaveBeenCalledWith(PageFields.PrintQuality, [pages[1].id], selectedOption.toString());
    });

    it("When changing media type Then the corresponding update model call is made", () => {
        const selectedOption = 1;
        const printQualitySelector = pageElements[1].query(By.css("#mediaType")).nativeElement as HTMLSelectElement;

        printQualitySelector.click();
        printQualitySelector.value = printQualitySelector.options[selectedOption].value;
        printQualitySelector.dispatchEvent(new Event("change"));

        expect(updatePageMock)
            .toHaveBeenCalledWith(PageFields.MediaType, [pages[1].id], selectedOption.toString());
    });

    it("When changing destination Then the corresponding update model call is made", () => {
        const selectedOption = 0;
        const destinationSelector = pageElements[1].query(By.css("#destination")).nativeElement as HTMLSelectElement;

        destinationSelector.click();
        destinationSelector.value = destinationSelector.options[selectedOption].value;
        destinationSelector.dispatchEvent(new Event("change"));

        expect(updatePageMock)
            .toHaveBeenCalledWith(PageFields.Destination, [pages[1].id], selectedOption.toString());
    });

    it("When changing language Then the capabilities are updated", () => {
        getCapabilitiesMock.calls.reset();
        getLocalizedCapabilityMock.calls.reset();

        (localizationService.language$ as Subject<any>).next();

        expect(getCapabilitiesMock).toHaveBeenCalledWith(PageFields.PrintQuality);
        expect(getCapabilitiesMock).toHaveBeenCalledWith(PageFields.MediaType);
        expect(getCapabilitiesMock).toHaveBeenCalledWith(PageFields.Destination);
        capabilities.forEach((capability) => {
            expect(getLocalizedCapabilityMock).toHaveBeenCalledWith(capability);
        });
        expect(getLocalizedCapabilityMock).toHaveBeenCalledTimes(capabilities.length * LocalizedFields);
    });

    it("When the component is destroyed Then it unsubscipts from localization changes", () => {
        fixture.destroy();
        expect((localizationService.language$ as Subject<any>).observers.length).toEqual(0);
    });
});
