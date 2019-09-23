import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { BrowserDynamicTestingModule } from "@angular/platform-browser-dynamic/testing";

import { configureTestSuite } from "../../../../../test/configureTestSuite";
import { CustomMatchers } from "../../../../../test/CustomMatchers";
import { TooltipDirectiveTestComponent } from "./test/tooltip-directive-test.component";
import { NgbTooltipConfig } from "./tooltip-config.service";
import { NgbTooltipWindowComponent } from "./tooltip.component";
import { NgbTooltipDirective } from "./tooltip.directive";

describe("ngb-tooltip", () => {

    configureTestSuite();

    let testFixture: ComponentFixture<TooltipDirectiveTestComponent>;

    // Matchers
    beforeAll(() => {
        jasmine.addMatchers(CustomMatchers);
    });

    beforeAll(() => {
        TestBed.configureTestingModule({
            declarations: [
                TooltipDirectiveTestComponent,
                NgbTooltipDirective,
                NgbTooltipWindowComponent
            ]
        }).overrideModule(BrowserDynamicTestingModule, {
            set: {
                entryComponents: [NgbTooltipWindowComponent],
            }
        });
    });

    beforeEach(() => {
        testFixture = TestBed.createComponent(TooltipDirectiveTestComponent);
        testFixture.detectChanges();
    });

    beforeEach(() => NgbTooltipDirective.nextId = 0);

    function getWindow(element) { return element.querySelector("ngb-tooltip-window"); }

    describe("basic functionality", () => {

        it("should open and close a tooltip - default settings and content as string", () => {
            const directive = testFixture.debugElement.query(By.css("#test1"));
            const defaultConfig = new NgbTooltipConfig();

            directive.triggerEventHandler("mouseenter", {});
            testFixture.detectChanges();
            const windowEl = getWindow(testFixture.nativeElement);

            expect(windowEl).toHaveCssClass("tooltip");
            expect(windowEl).toHaveCssClass(`bs-tooltip-${defaultConfig.placement}`);
            expect(windowEl.textContent.trim()).toBe("Great tip!");
            expect(windowEl.getAttribute("role")).toBe("tooltip");
            expect(windowEl.getAttribute("id")).toBe("ngb-tooltip-0");
            expect(directive.nativeElement.getAttribute("aria-describedby")).toBe("ngb-tooltip-0");

            directive.triggerEventHandler("mouseleave", {});
            testFixture.detectChanges();
            expect(getWindow(testFixture.nativeElement)).toBeNull();
            expect(directive.nativeElement.getAttribute("aria-describedby")).toBeNull();
        });

        it("should open and close a tooltip - default settings and content from a template", () => {
            const directive = testFixture.debugElement.query(By.css("#test2"));

            directive.triggerEventHandler("mouseenter", {});
            testFixture.detectChanges();
            const windowEl = getWindow(testFixture.nativeElement);

            expect(windowEl).toHaveCssClass("tooltip");
            expect(windowEl).toHaveCssClass("bs-tooltip-top");
            expect(windowEl.textContent.trim()).toBe("Hello, World!");
            expect(windowEl.getAttribute("role")).toBe("tooltip");
            expect(windowEl.getAttribute("id")).toBe("ngb-tooltip-1");
            expect(directive.nativeElement.getAttribute("aria-describedby")).toBe("ngb-tooltip-1");

            directive.triggerEventHandler("mouseleave", {});
            testFixture.detectChanges();
            expect(getWindow(testFixture.nativeElement)).toBeNull();
            expect(directive.nativeElement.getAttribute("aria-describedby")).toBeNull();
        });

        it("should open and close a tooltip - default settings and custom class", () => {
            const directive = testFixture.debugElement.query(By.css("#test3"));

            directive.triggerEventHandler("mouseenter", {});
            testFixture.detectChanges();
            const windowEl = getWindow(testFixture.nativeElement);

            expect(windowEl).toHaveCssClass("tooltip");
            expect(windowEl).toHaveCssClass("bs-tooltip-top");
            expect(windowEl.textContent.trim()).toBe("Great tip!");
            expect(windowEl.getAttribute("role")).toBe("tooltip");
            expect(windowEl.getAttribute("id")).toBe("ngb-tooltip-2");
            expect(directive.nativeElement.getAttribute("aria-describedby")).toBe("ngb-tooltip-2");

            directive.triggerEventHandler("mouseleave", {});
            testFixture.detectChanges();
            expect(getWindow(testFixture.nativeElement)).toBeNull();
            expect(directive.nativeElement.getAttribute("aria-describedby")).toBeNull();
        });

        it("should not open a tooltip if content is falsy", () => {
            const directive = testFixture.debugElement.query(By.css("#test4"));

            directive.triggerEventHandler("mouseenter", {});
            testFixture.detectChanges();
            const windowEl = getWindow(testFixture.nativeElement);

            expect(windowEl).toBeNull();
        });

        it("should close the tooltip tooltip if content becomes falsy", () => {
            const directive = testFixture.debugElement.query(By.css("#test5"));

            directive.triggerEventHandler("mouseenter", {});
            testFixture.detectChanges();
            expect(getWindow(testFixture.nativeElement)).not.toBeNull();

            testFixture.componentInstance.name = null;
            testFixture.detectChanges();
            expect(getWindow(testFixture.nativeElement)).toBeNull();
        });

        it("should not open a tooltip if [disableTooltip] flag", () => {
            const directive = testFixture.debugElement.query(By.css("#test6"));

            directive.triggerEventHandler("mouseenter", {});
            testFixture.detectChanges();
            const windowEl = getWindow(testFixture.nativeElement);

            expect(windowEl).toBeNull();
        });

        it("should allow re-opening previously closed tooltips", () => {
            const directive = testFixture.debugElement.query(By.css("#test7"));

            directive.triggerEventHandler("mouseenter", {});
            testFixture.detectChanges();
            expect(getWindow(testFixture.nativeElement)).not.toBeNull();

            directive.triggerEventHandler("mouseleave", {});
            testFixture.detectChanges();
            expect(getWindow(testFixture.nativeElement)).toBeNull();

            directive.triggerEventHandler("mouseenter", {});
            testFixture.detectChanges();
            expect(getWindow(testFixture.nativeElement)).not.toBeNull();
        });

        it("should not leave dangling tooltips in the DOM", () => {
            const directive = testFixture.debugElement.query(By.css("#test8"));

            directive.triggerEventHandler("mouseenter", {});
            testFixture.detectChanges();
            expect(getWindow(testFixture.nativeElement)).not.toBeNull();

            testFixture.componentInstance.show = false;
            testFixture.detectChanges();
            expect(getWindow(testFixture.nativeElement)).toBeNull();
        });

        it("should properly cleanup tooltips with manual triggers", () => {
            const directive = testFixture.debugElement.query(By.css("#test9"));

            directive.triggerEventHandler("mouseenter", {});
            testFixture.detectChanges();
            expect(getWindow(testFixture.nativeElement)).not.toBeNull();

            testFixture.componentInstance.show = false;
            testFixture.detectChanges();
            expect(getWindow(testFixture.nativeElement)).toBeNull();
        });

        describe("positioning", () => {

            it("should use requested position", () => {
                const directive = testFixture.debugElement.query(By.css("#test10"));

                directive.triggerEventHandler("mouseenter", {});
                testFixture.detectChanges();
                const windowEl = getWindow(testFixture.nativeElement);

                expect(windowEl).toHaveCssClass("tooltip");
                expect(windowEl).toHaveCssClass("bs-tooltip-left");
                expect(windowEl.textContent.trim()).toBe("Great tip!");
            });

            it("should have proper arrow placement", () => {
                const directive = testFixture.debugElement.query(By.css("#test11"));

                directive.triggerEventHandler("mouseenter", {});
                testFixture.detectChanges();
                const windowEl = getWindow(testFixture.nativeElement);

                expect(windowEl).toHaveCssClass("tooltip");
                expect(windowEl).toHaveCssClass("bs-tooltip-right");
                expect(windowEl).toHaveCssClass("bs-tooltip-right-top");
                expect(windowEl.textContent.trim()).toBe("Great tip!");
            });

            it("should accept placement in array(second value of the array should be applied)", () => {
                const directive = testFixture.debugElement.query(By.css("#test12"));

                directive.triggerEventHandler("mouseenter", {});
                testFixture.detectChanges();
                const windowEl = getWindow(testFixture.nativeElement);

                expect(windowEl).toHaveCssClass("tooltip");
                expect(windowEl).toHaveCssClass("bs-tooltip-top");
                expect(windowEl).toHaveCssClass("bs-tooltip-top-right");
                expect(windowEl.textContent.trim()).toBe("Great tip!");
            });

            it("should apply auto placement", () => {
                const directive = testFixture.debugElement.query(By.css("#test13"));

                directive.triggerEventHandler("mouseenter", {});
                testFixture.detectChanges();
                const windowEl = getWindow(testFixture.nativeElement);

                expect(windowEl).toHaveCssClass("tooltip");
                // actual placement with auto is not known in advance, so use regex to check it
                expect(windowEl.getAttribute("class")).toMatch("bs-tooltip-\.");
                expect(windowEl.textContent.trim()).toBe("Great tip!");
            });

        });

        describe("triggers", () => {

            it("should support toggle triggers", () => {
                const directive = testFixture.debugElement.query(By.css("#test14"));

                directive.triggerEventHandler("click", {});
                testFixture.detectChanges();
                expect(getWindow(testFixture.nativeElement)).not.toBeNull();

                directive.triggerEventHandler("click", {});
                testFixture.detectChanges();
                expect(getWindow(testFixture.nativeElement)).toBeNull();
            });

            it("should non-default toggle triggers", () => {
                const directive = testFixture.debugElement.query(By.css("#test15"));

                directive.triggerEventHandler("mouseenter", {});
                testFixture.detectChanges();
                expect(getWindow(testFixture.nativeElement)).not.toBeNull();

                directive.triggerEventHandler("click", {});
                testFixture.detectChanges();
                expect(getWindow(testFixture.nativeElement)).toBeNull();
            });

            it("should support multiple triggers", () => {
                const directive = testFixture.debugElement.query(By.css("#test16"));

                directive.triggerEventHandler("mouseenter", {});
                testFixture.detectChanges();
                expect(getWindow(testFixture.nativeElement)).not.toBeNull();

                directive.triggerEventHandler("click", {});
                testFixture.detectChanges();
                expect(getWindow(testFixture.nativeElement)).toBeNull();
            });

            it("should not use default for manual triggers", () => {
                const directive = testFixture.debugElement.query(By.css("#test17"));

                directive.triggerEventHandler("mouseenter", {});
                testFixture.detectChanges();
                expect(getWindow(testFixture.nativeElement)).toBeNull();
            });

            it("should allow toggling for manual triggers", () => {
                const button = testFixture.nativeElement.querySelector("#test18");

                button.click();
                testFixture.detectChanges();
                expect(getWindow(testFixture.nativeElement)).not.toBeNull();

                button.click();
                testFixture.detectChanges();
                expect(getWindow(testFixture.nativeElement)).toBeNull();
            });

            it("should allow open / close for manual triggers", () => {
                const open = testFixture.nativeElement.querySelector("#test19-open");
                open.click();
                expect(getWindow(testFixture.nativeElement)).not.toBeNull();

                const close = testFixture.nativeElement.querySelector("#test19-close");
                close.click();
                expect(getWindow(testFixture.nativeElement)).toBeNull();
            });

            it("should not throw when open called for manual triggers and open tooltip", () => {
                const open = testFixture.nativeElement.querySelector("#test20-open");

                open.click();
                expect(getWindow(testFixture.nativeElement)).not.toBeNull();

                open.click();
                expect(getWindow(testFixture.nativeElement)).not.toBeNull();
            });

            it("should not throw when closed called for manual triggers and closed tooltip", () => {
                const close = testFixture.nativeElement.querySelector("#test21-close");
                close.click();

                expect(getWindow(testFixture.nativeElement)).toBeNull();
            });
        });
    });

    describe("container", () => {

        it("should be appended to the element matching the selector passed to \"container\"", () => {
            const directive = testFixture.debugElement.query(By.css("#test22"));

            directive.triggerEventHandler("mouseenter", {});
            testFixture.detectChanges();
            expect(getWindow(testFixture.nativeElement)).toBeNull();
            expect(getWindow(document.querySelector("body"))).not.toBeNull();
        });

        it("should properly destroy tooltips when the \"container\" option is used", () => {
            const directive = testFixture.debugElement.query(By.css("#test23"));

            directive.triggerEventHandler("mouseenter", {});
            testFixture.detectChanges();

            expect(getWindow(document.querySelector("body"))).not.toBeNull();
            testFixture.componentRef.instance.show = false;
            testFixture.detectChanges();
            expect(getWindow(document.querySelector("body"))).toBeNull();
        });
    });

    describe("visibility", () => {
        it("should emit events when showing and hiding tooltip", () => {
            const directive = testFixture.debugElement.query(By.css("#test24"));

            const shownSpy = spyOn(testFixture.componentInstance, "shown");
            const hiddenSpy = spyOn(testFixture.componentInstance, "hidden");

            directive.triggerEventHandler("click", {});
            testFixture.detectChanges();
            expect(getWindow(testFixture.nativeElement)).not.toBeNull();
            expect(shownSpy).toHaveBeenCalled();

            directive.triggerEventHandler("click", {});
            testFixture.detectChanges();
            expect(getWindow(testFixture.nativeElement)).toBeNull();
            expect(hiddenSpy).toHaveBeenCalled();
        });

        it("should not emit close event when already closed", () => {
            const shownSpy = spyOn(testFixture.componentInstance, "shown");
            const hiddenSpy = spyOn(testFixture.componentInstance, "hidden");

            testFixture.componentInstance.tooltipReport.open();
            testFixture.componentInstance.tooltipReport.open();

            expect(shownSpy).toHaveBeenCalledTimes(1);
            expect(hiddenSpy).not.toHaveBeenCalled();
            expect(getWindow(testFixture.nativeElement)).not.toBeNull();
        });

        it("should report correct visibility", () => {
            expect(testFixture.componentInstance.tooltip.isOpen()).toBeFalsy();

            testFixture.componentInstance.tooltip.open();
            expect(testFixture.componentInstance.tooltip.isOpen()).toBeTruthy();

            testFixture.componentInstance.tooltip.close();
            expect(testFixture.componentInstance.tooltip.isOpen()).toBeFalsy();
        });
    });

    describe("Custom config", () => {
        let config: NgbTooltipConfig;

        beforeEach(() => {
            config = TestBed.get(NgbTooltipConfig);
            config.placement = "bottom";
            config.triggers = "click";
            config.container = "body";
            config.tooltipClass = "my-custom-class";

            testFixture = TestBed.createComponent(TooltipDirectiveTestComponent);
        });

        it("should initialize inputs with provided config", () => {
            const tooltip = testFixture.componentInstance.tooltip;

            expect(tooltip.placement).toBe(config.placement);
            expect(tooltip.triggers).toBe(config.triggers);
            expect(tooltip.container).toBe(config.container);
            expect(tooltip.tooltipClass).toBe(config.tooltipClass);
        });
    });

    describe("non-regression", () => {

        /**
         * Under very specific conditions ngOnDestroy can be invoked without calling ngOnInit first.
         * See discussion in https://github.com/ng-bootstrap/ng-bootstrap/issues/2199 for more details.
         */
        it("should not try to call listener cleanup function when no listeners registered", () => {
            const buttonEl = testFixture.debugElement.query(By.css("#createAndDestroy"));
            buttonEl.triggerEventHandler("click", {});
        });
    });
});
