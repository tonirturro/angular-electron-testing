import { Component, TemplateRef, ViewChild, ViewContainerRef } from "@angular/core";
import { NgbTooltipDirective } from "../tooltip.directive";

@Component({
  selector: "test-cmpt",
  templateUrl: "./tooltip-directive-test.component.html"
})

export class TooltipDirectiveTestComponent {
  public name = "World";
  public show = true;
  public currentTest: string;

  @ViewChild("test1Tooltip") public tooltip: NgbTooltipDirective;
  @ViewChild("test24Tooltip") public tooltipReport: NgbTooltipDirective;

  constructor(private vcRef: ViewContainerRef) { }

  // tslint:disable-next-line: no-empty
  public shown() { }
  // tslint:disable-next-line: no-empty
  public hidden() { }

  public createAndDestroyTplWithATooltip(tpl: TemplateRef<any>) {
    this.vcRef.createEmbeddedView(tpl, {}, 0);
    this.vcRef.remove(0);
  }
}
