import { DebugElement } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";

import { TranslateFakeLoader, TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { configureTestSuite } from "../../../../../test/configureTestSuite";
import { NgbTooltipDirective } from "../../UiLib";
import { ToolBarComponent } from "./toolbar.component";

describe("Given a toolbar component", () => {

    configureTestSuite();

    let element: DebugElement;
    let component: ToolBarComponent;
    let fixture: ComponentFixture<ToolBarComponent>;

    beforeAll(() => {
        TestBed.configureTestingModule({
            declarations: [ ToolBarComponent, NgbTooltipDirective ],
            imports: [
                TranslateModule.forRoot({
                    loader: { provide: TranslateLoader, useClass: TranslateFakeLoader }
                })
            ]
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ToolBarComponent);
        component = fixture.componentInstance;
        element = fixture.debugElement;
        fixture.detectChanges();
    });

    afterAll(() => {
        NgbTooltipDirective.nextId = 0;
    });

    it("When created Then it has the html defined", () => {
        expect((element.nativeElement as Element).innerHTML).toBeDefined();
    });

    it("When clicking on add device button Then the action is reported", () => {
        let addButtonClick = false;
        const addButton = element.query(By.css("#addDevice")).nativeElement as HTMLButtonElement;
        component.onAddDevice.subscribe(() => {
            addButtonClick = true;
        });

        addButton.click();

        expect(addButtonClick).toBeTruthy();
    });

    it("When clicking on edit devices button and whe are editing pages Then the action is reported", () => {
        component.editingDevices = false;
        fixture.detectChanges();
        let editDevicesButtonClick = false;
        const editDevicesButton = element.query(By.css("#editDevice")).nativeElement as HTMLButtonElement;
        component.onEditDevices.subscribe(() => {
            editDevicesButtonClick = true;
        });

        editDevicesButton.click();

        expect(editDevicesButtonClick).toBeTruthy();
    });

    it("When clicking on edit devices button and whe are editing devices Then the action is not reported", () => {
        component.editingDevices = true;
        fixture.detectChanges();
        let editDevicesButtonClick = false;
        const editDevicesButton = element.query(By.css("#editDevice")).nativeElement as HTMLButtonElement;
        component.onEditPages.subscribe(() => {
            editDevicesButtonClick = true;
        });

        editDevicesButton.click();

        expect(editDevicesButtonClick).toBeFalsy();
    });

    it("When clicking on edit pages button and whe are editing devices Then the action is reported", () => {
        component.editingDevices = true;
        fixture.detectChanges();
        let editPagesButtonClick = false;
        const editPagesButton = element.query(By.css("#editPages")).nativeElement as HTMLButtonElement;
        component.onEditPages.subscribe(() => {
            editPagesButtonClick = true;
        });

        editPagesButton.click();

        expect(editPagesButtonClick).toBeTruthy();
    });

    it("When clicking on edit pages button and whe are editind pages Then the action not is reported", () => {
        component.editingDevices = false;
        fixture.detectChanges();
        let editPagesButtonClick = false;
        const editPagesButton =  element.query(By.css("#editPages")).nativeElement as HTMLButtonElement;
        component.onEditPages.subscribe(() => {
            editPagesButtonClick = true;
        });

        editPagesButton.click();

        expect(editPagesButtonClick).toBeFalsy();
    });

    it("When clicking on settings button Then the action is reported", () => {
        let settingsButtonClick = false;
        const settingsButton = element.query(By.css("#settings")).nativeElement as HTMLButtonElement;
        component.onSettings.subscribe(() => {
            settingsButtonClick = true;
        });

        settingsButton.click();

        expect(settingsButtonClick).toBeTruthy();
    });

    it("When clicking on close button Then the action is reported", () => {
        let closeButtonClick = false;
        const closeButton = element.query(By.css("#close")).nativeElement as HTMLButtonElement;
        component.onClose.subscribe(() => {
            closeButtonClick = true;
        });

        closeButton.click();

        expect(closeButtonClick).toBeTruthy();
    });
});
