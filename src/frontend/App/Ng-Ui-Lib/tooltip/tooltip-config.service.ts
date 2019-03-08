import {Injectable} from "@angular/core";
import {PlacementArray} from "../util/positioning";

/**
 * Configuration service for the NgbTooltip directive.
 * You can inject this service, typically in your root component, and customize the values of its properties in
 * order to provide default values for all the tooltips used in the application.
 */
@Injectable({providedIn: "root"})
export class NgbTooltipConfig {
  public autoClose: boolean | "inside" | "outside" = true;
  public placement: PlacementArray = "top";
  public triggers = "hover";
  public container: string;
  public disableTooltip = false;
  public tooltipClass: string;
}
