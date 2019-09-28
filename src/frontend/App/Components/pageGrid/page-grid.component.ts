import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { combineLatest, Subscription } from "rxjs";
import { PageFields } from "../../../../common/model";
import { IPage, ISelectableOption } from "../../../../common/rest";
import { DataService } from "../../Services/data.service";
import { LocalizationService } from "../localization.service";

@Component({
    selector: "page-grid",
    styleUrls: [ "./page-grid.component.scss" ],
    templateUrl: "./page-grid.component.html"
})

export class PageGridComponent implements OnInit, OnDestroy {

    @Input() public selectedDeviceId: string;
    public deviceId: number;

    /*
     * Text
     */
    public readonly addTooltip = "STR_Add_Page_Tooltip";
    public readonly deleteTooltip = "STR_Delete_Page_Tooltip";

    /**
     * Internal properties
     */
    private selectedPages: number[] = [];
    private localizedPrintQualityCapabilities: ISelectableOption[] = [];
    private localizedMediaTypeCapabilities: ISelectableOption[] = [];
    private localizedDestinationCapabilities: ISelectableOption[] = [];
    private localizationSubscription: Subscription;
    private cachedPageSizes: ISelectableOption[] = [];

    constructor(
        private dataService: DataService,
        private localizationService: LocalizationService
    ) {}

    public ngOnInit() {
        this.deviceId = parseInt(this.selectedDeviceId, 10);
        this.loadLocalizedCapabilities();
        this.localizationSubscription = this.localizationService.language$.subscribe(() => {
            this.loadLocalizedCapabilities();
        });
        this.dataService
            .getCapabilities(PageFields.PageSize)
            .subscribe((capabilities) => {
                this.cachedPageSizes = capabilities;
            });
    }

    public ngOnDestroy(): void {
        this.localizationSubscription.unsubscribe();
    }

    /**
     * Retrieves the model pages
     */
    public get pages(): IPage[] {
         return this.dataService.pages.filter((page) => page.deviceId === this.deviceId);
    }

    /**
     * Get the available page options
     */
    public get PageSizeOptions(): ISelectableOption[] {
            return this.cachedPageSizes;
    }

    /**
     * Get the available print quality options
     */
    public get PrintQualityOptions(): ISelectableOption[] {
        return this.localizedPrintQualityCapabilities;
    }

    /**
     * Get the available madia type options
     */
    public get MediaTypeOptions(): ISelectableOption[] {
        return this.localizedMediaTypeCapabilities;
    }

    /**
     * Get the available destination options
     */
    public get DestinationOptions(): ISelectableOption[] {
        return this.localizedDestinationCapabilities;
    }

    /**
     * Request a new page
     */
    public addPage(): void {
        this.dataService.addNewPage(this.deviceId);
    }

    /**
     * Request a page deletion
     * @param pageTodelete is the page id to be deletd
     */
    public deletePage(pageTodelete: number): void {
        this.dataService.deletePage(pageTodelete);
    }

    /**
     * Request a page size update
     * @param newValue is the new page size value
     */
    public updatePageSize(newValue: string): void {
        this.dataService.updatePageField(PageFields.PageSize, this.selectedPages, newValue);
    }

    /**
     * Request a print quality update
     * @param newValue is the new print quality value
     */
    public updatePrintQuality(newValue: string): void {
        this.dataService.updatePageField(PageFields.PrintQuality, this.selectedPages, newValue);
    }

    /**
     * Request a media type update
     * @param newValue is the new media type value
     */
    public updateMediaType(newValue: string): void {
        this.dataService.updatePageField(PageFields.MediaType, this.selectedPages, newValue);
    }

    /**
     * Request a destination update
     * @param newValue is the new media type destination value
     */
    public updateDestination(newValue: string): void {
        this.dataService.updatePageField(PageFields.Destination, this.selectedPages, newValue);
    }

    /**
     * Page selection
     * @param event is the event generating the click
     * @param page is the selected page
     */
    public selectPage(event: Event, pageId: number): void {
        // Do dot break multiselection if clicked on selection
        const isSelector = (event.target as Element).tagName === "SELECT";
        if (isSelector) {
            this.updatePageSelection(pageId, true);
            return;
        }

        // Set selection
        const isMultiSelection = (event as MouseEvent).ctrlKey;
        this.updatePageSelection(pageId, isMultiSelection);
    }

    /**
     * Checks if the page is at the selected list
     * @param pageId the id to be checked
     */
    public isSelected(pageId: number): boolean {
        return this.selectedPages.indexOf(pageId) > -1;
    }

    /**
     * Modify the page selection list based on the id selected and the multiselection option
     * @param pageId the id to be selected
     * @param multiselection if we consider multiselection
     */
    private updatePageSelection(pageId: number, multiselection: boolean) {
        if (multiselection && this.selectedPages.length > 0) {
            const indexOfSelectedPage = this.selectedPages.indexOf(pageId);
            const currentSelected = this.selectedPages.concat();
            if (indexOfSelectedPage < 1) {
                currentSelected.push(pageId);
            } else {
                currentSelected.splice(indexOfSelectedPage, 1);
            }
            this.selectedPages = currentSelected;
        } else {
            this.selectedPages = [pageId];
        }
    }

    /**
     * Gets the capabilites that need to be translated and translates them
     */
    private loadLocalizedCapabilities() {
        this.dataService
            .getCapabilities(PageFields.PrintQuality)
            .subscribe((capabilities) => {
                const requests = capabilities.
                    map((capability) => this.localizationService.getLocalizedCapability(capability));
                combineLatest(requests).subscribe((localizedCapabilities) => {
                        this.localizedPrintQualityCapabilities = localizedCapabilities;
                });
            });
        this.dataService
            .getCapabilities(PageFields.MediaType)
            .subscribe((capabilities) => {
                const requests = capabilities.
                    map((capability) => this.localizationService.getLocalizedCapability(capability));
                combineLatest(requests).subscribe((localizedCapabilities) => {
                        this.localizedMediaTypeCapabilities = localizedCapabilities;
                });
            });
        this.dataService
            .getCapabilities(PageFields.Destination)
            .subscribe((capabilities) => {
                const requests = capabilities.
                    map((capability) => this.localizationService.getLocalizedCapability(capability));
                combineLatest(requests).subscribe((localizedCapabilities) => {
                        this.localizedDestinationCapabilities = localizedCapabilities;
                });
            });
    }
}
