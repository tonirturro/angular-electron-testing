import { TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { configureTestSuite } from "../../../../../test/configureTestSuite";
import { NgbActiveModal } from "../../UiLib/modal/modal-active";
import { ELanguages, ILanguageParam } from "../definitions";
import { SettingsDialogComponent } from "./settings-dialog.component";

describe("Given a settings dialog component", () => {

    configureTestSuite();

    let element: Element;
    let component: SettingsDialogComponent;
    let modal: NgbActiveModal;

    beforeAll(() => {
        TestBed.configureTestingModule({
            declarations: [ SettingsDialogComponent ],
            imports: [
                FormsModule,
                TranslateModule.forRoot({
                    loader: { provide: TranslateLoader, useClass: TranslateFakeLoader }
                })
            ],
            providers: [ NgbActiveModal ]
        });
    });

    beforeEach(() => {
        const fixture = TestBed.createComponent(SettingsDialogComponent);
        modal = TestBed.get(NgbActiveModal);
        component = fixture.componentInstance;
        component.params = {
                language: ELanguages.Klingon
            } as ILanguageParam;
        element = fixture.nativeElement;
        fixture.detectChanges();
    });

    it("When created Then it has the html defined", () => {
        expect(element.innerHTML.includes("modal-body")).toBeTruthy();
    });

    it("When setting a language Then it is selected", () => {
        expect(Number.parseInt(component.languageOption, 10)).toEqual(component.params.language);
    });

    it("When clicking on first button Then the close method is called", () => {
        const closeSpy = spyOn(modal, "close");
        const firstButton = element.querySelectorAll("button").item(0);

        firstButton.click();

        expect(closeSpy).toHaveBeenCalledWith(component.params.language);
    });

    it("When clicking on second button Then the dismiss method is called", () => {
        const dismissSpy = spyOn(modal, "dismiss");
        const secondButton = element.querySelectorAll("button").item(1);

        secondButton.click();

        expect(dismissSpy).toHaveBeenCalled();
    });
});
