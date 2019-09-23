import {
    ChangeDetectionStrategy,
    Component,
    TemplateRef,
    ViewChild,
    ViewContainerRef
} from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { BrowserDynamicTestingModule } from "@angular/platform-browser-dynamic/testing";

import { UserInterfaceLibModule } from "..";
import { configureTestSuite } from "../../../../../test/configureTestSuite";
import { CustomMatchers } from "../../../../../test/CustomMatchers";
import { TooltipDirectiveTestComponent } from "./test/tooltip-directive-test.component";
import { NgbTooltipConfig } from "./tooltip-config.service";
import { NgbTooltipWindowComponent } from "./tooltip.component";
import { NgbTooltipDirective } from "./tooltip.directive";

describe("ngb-tooltip", () => {

    configureTestSuite();

    let testFixture: ComponentFixture<TooltipDirectiveTestComponent>;
    let testComponent: TooltipDirectiveTestComponent;

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
        testComponent = testFixture.componentInstance;

        testFixture.detectChanges();
    });

    beforeAll(() => NgbTooltipDirective.nextId = 0);
    afterAll(() => NgbTooltipDirective.nextId = 0);

    function getWindow(element) { return element.querySelector("ngb-tooltip-window"); }

    describe("basic functionality", () => {

        it("should open and close a tooltip - default settings and content as string", () => {
            testComponent.currentTest = "test1";
            testFixture.detectChanges();

            const directive = testFixture.debugElement.query(By.directive(NgbTooltipDirective));
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
            testComponent.currentTest = "test2";
            testFixture.detectChanges();

            const directive = testFixture.debugElement.query(By.directive(NgbTooltipDirective));

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
            testComponent.currentTest = "test3";
            testFixture.detectChanges();

            const directive = testFixture.debugElement.query(By.directive(NgbTooltipDirective));

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
            testComponent.currentTest = "test4";
            testFixture.detectChanges();

            const directive = testFixture.debugElement.query(By.directive(NgbTooltipDirective));

            directive.triggerEventHandler("mouseenter", {});
            testFixture.detectChanges();
            const windowEl = getWindow(testFixture.nativeElement);

            expect(windowEl).toBeNull();
        });

        it("should close the tooltip tooltip if content becomes falsy", () => {
            testComponent.currentTest = "test5";
            testFixture.detectChanges();

            const directive = testFixture.debugElement.query(By.directive(NgbTooltipDirective));

            directive.triggerEventHandler("mouseenter", {});
            testFixture.detectChanges();
            expect(getWindow(testFixture.nativeElement)).not.toBeNull();

            testFixture.componentInstance.name = null;
            testFixture.detectChanges();
            expect(getWindow(testFixture.nativeElement)).toBeNull();
        });

        it("should not open a tooltip if [disableTooltip] flag", () => {
            testComponent.currentTest = "test6";
            testFixture.detectChanges();

            const directive = testFixture.debugElement.query(By.directive(NgbTooltipDirective));

            directive.triggerEventHandler("mouseenter", {});
            testFixture.detectChanges();
            const windowEl = getWindow(testFixture.nativeElement);

            expect(windowEl).toBeNull();
        });

        it("should allow re-opening previously closed tooltips", () => {
            testComponent.currentTest = "test7";
            testFixture.detectChanges();

            const directive = testFixture.debugElement.query(By.directive(NgbTooltipDirective));

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
            testComponent.currentTest = "test8";
            testFixture.detectChanges();

            const directive = testFixture.debugElement.query(By.directive(NgbTooltipDirective));

            directive.triggerEventHandler("mouseenter", {});
            testFixture.detectChanges();
            expect(getWindow(testFixture.nativeElement)).not.toBeNull();

            testFixture.componentInstance.show = false;
            testFixture.detectChanges();
            expect(getWindow(testFixture.nativeElement)).toBeNull();
        });

        it("should properly cleanup tooltips with manual triggers", () => {
            testComponent.currentTest = "test9";
            testFixture.detectChanges();

            const directive = testFixture.debugElement.query(By.directive(NgbTooltipDirective));

            directive.triggerEventHandler("mouseenter", {});
            testFixture.detectChanges();
            expect(getWindow(testFixture.nativeElement)).not.toBeNull();

            testFixture.componentInstance.show = false;
            testFixture.detectChanges();
            expect(getWindow(testFixture.nativeElement)).toBeNull();
        });

        describe("positioning", () => {

            it("should use requested position", () => {
                testComponent.currentTest = "test10";
                testFixture.detectChanges();

                const directive = testFixture.debugElement.query(By.directive(NgbTooltipDirective));

                directive.triggerEventHandler("mouseenter", {});
                testFixture.detectChanges();
                const windowEl = getWindow(testFixture.nativeElement);

                expect(windowEl).toHaveCssClass("tooltip");
                expect(windowEl).toHaveCssClass("bs-tooltip-left");
                expect(windowEl.textContent.trim()).toBe("Great tip!");
            });

            it("should have proper arrow placement", () => {
                testComponent.currentTest = "test11";
                testFixture.detectChanges();

                const directive = testFixture.debugElement.query(By.directive(NgbTooltipDirective));

                directive.triggerEventHandler("mouseenter", {});
                testFixture.detectChanges();
                const windowEl = getWindow(testFixture.nativeElement);

                expect(windowEl).toHaveCssClass("tooltip");
                expect(windowEl).toHaveCssClass("bs-tooltip-right");
                expect(windowEl).toHaveCssClass("bs-tooltip-right-top");
                expect(windowEl.textContent.trim()).toBe("Great tip!");
            });

            it("should accept placement in array(second value of the array should be applied)", () => {
                testComponent.currentTest = "test12";
                testFixture.detectChanges();

                const directive = testFixture.debugElement.query(By.directive(NgbTooltipDirective));

                directive.triggerEventHandler("mouseenter", {});
                testFixture.detectChanges();
                const windowEl = getWindow(testFixture.nativeElement);

                expect(windowEl).toHaveCssClass("tooltip");
                expect(windowEl).toHaveCssClass("bs-tooltip-top");
                expect(windowEl).toHaveCssClass("bs-tooltip-top-right");
                expect(windowEl.textContent.trim()).toBe("Great tip!");
            });

            it("should apply auto placement", () => {
                testComponent.currentTest = "test13";
                testFixture.detectChanges();

                const directive = testFixture.debugElement.query(By.directive(NgbTooltipDirective));

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
                testComponent.currentTest = "test14";
                testFixture.detectChanges();

                const directive = testFixture.debugElement.query(By.directive(NgbTooltipDirective));

                directive.triggerEventHandler("click", {});
                testFixture.detectChanges();
                expect(getWindow(testFixture.nativeElement)).not.toBeNull();

                directive.triggerEventHandler("click", {});
                testFixture.detectChanges();
                expect(getWindow(testFixture.nativeElement)).toBeNull();
            });

            it("should non-default toggle triggers", () => {
                testComponent.currentTest = "test15";
                testFixture.detectChanges();

                const directive = testFixture.debugElement.query(By.directive(NgbTooltipDirective));

                directive.triggerEventHandler("mouseenter", {});
                testFixture.detectChanges();
                expect(getWindow(testFixture.nativeElement)).not.toBeNull();

                directive.triggerEventHandler("click", {});
                testFixture.detectChanges();
                expect(getWindow(testFixture.nativeElement)).toBeNull();
            });

            it("should support multiple triggers", () => {
                testComponent.currentTest = "test16";
                testFixture.detectChanges();

                const directive = testFixture.debugElement.query(By.directive(NgbTooltipDirective));

                directive.triggerEventHandler("mouseenter", {});
                testFixture.detectChanges();
                expect(getWindow(testFixture.nativeElement)).not.toBeNull();

                directive.triggerEventHandler("click", {});
                testFixture.detectChanges();
                expect(getWindow(testFixture.nativeElement)).toBeNull();
            });

            it("should not use default for manual triggers", () => {
                testComponent.currentTest = "test17";
                testFixture.detectChanges();

                const directive = testFixture.debugElement.query(By.directive(NgbTooltipDirective));

                directive.triggerEventHandler("mouseenter", {});
                testFixture.detectChanges();
                expect(getWindow(testFixture.nativeElement)).toBeNull();
            });

            it("should allow toggling for manual triggers", () => {
                testComponent.currentTest = "test18";
                testFixture.detectChanges();

                const button = testFixture.nativeElement.querySelector("button");

                button.click();
                testFixture.detectChanges();
                expect(getWindow(testFixture.nativeElement)).not.toBeNull();

                button.click();
                testFixture.detectChanges();
                expect(getWindow(testFixture.nativeElement)).toBeNull();
            });

            it("should allow open / close for manual triggers", () => {
                testComponent.currentTest = "test19";
                testFixture.detectChanges();

                const buttons = testFixture.nativeElement.querySelectorAll("button");

                buttons[0].click();  // open
                testFixture.detectChanges();
                expect(getWindow(testFixture.nativeElement)).not.toBeNull();

                buttons[1].click();  // close
                testFixture.detectChanges();
                expect(getWindow(testFixture.nativeElement)).toBeNull();
            });

            it("should not throw when open called for manual triggers and open tooltip", () => {
                testComponent.currentTest = "test20";
                testFixture.detectChanges();

                const button = testFixture.nativeElement.querySelector("button");

                button.click();  // open
                testFixture.detectChanges();
                expect(getWindow(testFixture.nativeElement)).not.toBeNull();

                button.click();  // open
                testFixture.detectChanges();
                expect(getWindow(testFixture.nativeElement)).not.toBeNull();
            });

            it("should not throw when closed called for manual triggers and closed tooltip", () => {
                testComponent.currentTest = "test21";
                testFixture.detectChanges();

                const button = testFixture.nativeElement.querySelector("button");

                button.click();  // close
                testFixture.detectChanges();
                expect(getWindow(testFixture.nativeElement)).toBeNull();
            });
        });
    });

    describe("container", () => {

        it("should be appended to the element matching the selector passed to \"container\"", () => {
            testComponent.currentTest = "test22";
            testFixture.detectChanges();

            const directive = testFixture.debugElement.query(By.directive(NgbTooltipDirective));

            directive.triggerEventHandler("mouseenter", {});
            testFixture.detectChanges();
            expect(getWindow(testFixture.nativeElement)).toBeNull();
            expect(getWindow(document.querySelector("body"))).not.toBeNull();
        });

        it("should properly destroy tooltips when the \"container\" option is used", () => {
            testComponent.currentTest = "test23";
            testFixture.detectChanges();

            const directive = testFixture.debugElement.query(By.directive(NgbTooltipDirective));

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
            testComponent.currentTest = "test24";
            testFixture.detectChanges();

            const directive = testFixture.debugElement.query(By.directive(NgbTooltipDirective));

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
            testComponent.currentTest = "test25";
            testFixture.detectChanges();

            const shownSpy = spyOn(testFixture.componentInstance, "shown");
            const hiddenSpy = spyOn(testFixture.componentInstance, "hidden");

            testFixture.componentInstance.tooltip.open();
            testFixture.detectChanges();

            testFixture.componentInstance.tooltip.open();
            testFixture.detectChanges();

            expect(getWindow(testFixture.nativeElement)).not.toBeNull();
            expect(shownSpy).toHaveBeenCalled();
            expect(shownSpy.calls.count()).toEqual(1);
            expect(hiddenSpy).not.toHaveBeenCalled();
        });

        it("should report correct visibility", () => {
            testComponent.currentTest = "test26";
            testFixture.detectChanges();

            expect(testFixture.componentInstance.tooltip.isOpen()).toBeFalsy();

            testFixture.componentInstance.tooltip.open();
            testFixture.detectChanges();
            expect(testFixture.componentInstance.tooltip.isOpen()).toBeTruthy();

            testFixture.componentInstance.tooltip.close();
            testFixture.detectChanges();
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
        });

        it("should initialize inputs with provided config", () => {
            testComponent.currentTest = "test1";
            testFixture.detectChanges();

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
            testComponent.currentTest = "test27";
            testFixture.detectChanges();

            const buttonEl = testFixture.debugElement.query(By.css("button"));
            buttonEl.triggerEventHandler("click", {});
        });
    });
});
