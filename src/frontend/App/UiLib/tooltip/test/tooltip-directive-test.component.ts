import { Component, TemplateRef, ViewChild, ViewContainerRef } from "@angular/core";
import { NgbTooltipDirective } from "../..";

@Component({
  selector: "test-cmpt",
  templateUrl: "./tooltip-directive-test.component.html"
})

export class TooltipDirectiveTestComponent {
  public name = "World";
  public show = true;
  public currentTest: string;

  @ViewChild(NgbTooltipDirective) public tooltip: NgbTooltipDirective;

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
