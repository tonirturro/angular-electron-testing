import { TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { configureTestSuite } from "../../../../../test/configureTestSuite";
import { IDevice } from "../../../../common/rest";
import { DataService } from "../../Services/data.service";
import { DataServiceMock } from "../../Services/data.service.mock";
import { DeviceEditComponent } from "./device-edit.component";

describe("Given a device edit component", () => {

    configureTestSuite();

    const Devices: IDevice[] = [
        { id: 0, name: "Device 1" }
    ];
    let element: Element;
    let updateDeviceNameMock: jasmine.Spy;

    beforeAll(() => {
        TestBed.configureTestingModule({
            declarations: [ DeviceEditComponent ],
            imports: [ FormsModule ],
            providers: [
                { provide: DataService, useClass: DataServiceMock }
            ]
         });
    });

    beforeEach(() => {
        const dataService = TestBed.get(DataService);
        spyOnProperty(dataService, "devices", "get").and.returnValue(Devices);
        updateDeviceNameMock = spyOn(dataService, "updateDeviceName");
    });

    beforeEach(() => {
        const fixture = TestBed.createComponent(DeviceEditComponent);
        const component = fixture.componentInstance;
        component.selectedDeviceId = Devices[0].id.toString();
        fixture.detectChanges();
        element = fixture.nativeElement;
    });

    it("When created Then it has the html defined", () => {
        expect(element.innerHTML).toBeDefined();
    });

    it("When clicking on the apply button it stored the edited name", () => {
        const button = element.querySelector("button");

        button.click();

        expect(updateDeviceNameMock).toHaveBeenCalledWith(Devices[0].id, Devices[0].name);
    });
});
