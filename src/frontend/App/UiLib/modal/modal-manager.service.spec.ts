import { IModalSettings } from "..";
import { configureTestSuite } from "../../../../../test/configureTestSuite";
import { IModalDescription, ModalManagerService } from "./modal-manager.service";
import { NgbModalRef } from "./modal-ref";

class ModalServiceMock {
    // tslint:disable-next-line: no-empty
    public open() {}
}

describe("Given a modal manager service", () => {

    configureTestSuite();

    const dialogName = "name";
    const dialogSettings = {
        size: "lg"
    } as IModalSettings;
    const dialogContent = "<div></div>";
    const minimumSettings = {
        backdrop: "static",
        keyboard: false,
        size: "sm"
    } as IModalSettings;
    const dialogResult = { data : "hello" };
    const dialogReject = "message";
    const modalRef = {
        // tslint:disable-next-line: no-empty
        close: () => {},
        componentInstance: {
            params: undefined
        },
        result: Promise.resolve(dialogResult)
    } as NgbModalRef;
    let service: ModalManagerService;
    let openModalMock: jasmine.Spy;

    beforeEach(() => {
        const modalService = new ModalServiceMock();
        openModalMock = spyOn(modalService, "open");
        openModalMock.and.returnValue(modalRef);
        service = new ModalManagerService(modalService as any);
    });

    it("Is instantiated", () => {
        expect(service).toBeDefined();
    });

    describe("And registering dialogs", () => {

        it("When the dialog has not been previously registered Then it succeeds", () => {
            expect(service.register("name", {} as IModalDescription)).toBeTruthy();
        });

        it("When the dialog has been previously registered it fails", () => {
            service.register(dialogName, {} as IModalDescription);
            expect(service.register(dialogName, {} as IModalDescription)).toBeFalsy();
        });
    });

    describe("And pushing a dialog", () => {

        it("When the dialog has not been previously registered Then it fails", (done) => {
            service.push("name").subscribe((result) => {
                expect(result).toBeNull();
                done();
            });
        });

        describe("And the dialog has been previously registered", () => {

            beforeEach(() => {
                service.register(dialogName, {
                    content: dialogContent,
                    settings: dialogSettings
                } as IModalDescription);
            });

            it("Then it opens a dialog", () => {
                service.push(dialogName);

                expect(openModalMock).toHaveBeenCalled();
            });

            it("Then it opens a dialog with at least the minimum dialog settings", () => {
                const expectedSettings: IModalSettings = { ...minimumSettings, ...dialogSettings };

                service.push(dialogName);

                expect(expectedSettings.size).toEqual(dialogSettings.size);
                expect(expectedSettings.backdrop).toEqual(minimumSettings.backdrop);
                expect(expectedSettings.keyboard).toEqual(minimumSettings.keyboard);
                expect(openModalMock).toHaveBeenCalledWith(dialogContent, expectedSettings);
            });

            it("Then it returns an observable", () => {
                const result = service.push(dialogName);

                expect(result.subscribe()).toBeDefined();
            });

            it("When it returns an observable Then the observable returns the dialog result", (done) => {
                service.push(dialogName).subscribe((result) => {
                    expect(result).toEqual(dialogResult);
                    done();
                });
            });

            it("When it returns an observable Then the observable returns the dialog rejection", (done) => {
                const modalRefReject = { ...modalRef };
                modalRefReject.result = Promise.reject(dialogReject);
                openModalMock.and.returnValue(modalRefReject);

                service.push(dialogName).subscribe(
                    // tslint:disable-next-line: no-empty
                    () => {},
                    (rejection) => {
                        expect(rejection).toEqual(dialogReject);
                        done();
                    });
            });

            it("When params are pushed Then the dialog is opened with this params", () => {
                const params = {
                    id: 1
                };

                service.push(dialogName, params);

                expect(modalRef.componentInstance.params).toEqual(params);
            });
        });
    });

    describe("And poping one dialog", () => {

        let closeMock: jasmine.Spy;

        beforeEach(() => {
            service.register(dialogName, {
                content: dialogContent,
                settings: dialogSettings
            } as IModalDescription);

            closeMock = spyOn(modalRef, "close");
        });

        it("When there is a dialog opened Then it closes the dialog", () => {
            service.push(dialogName);
            service.pop();

            expect(closeMock).toHaveBeenCalled();
        });

        it("When there is no dialog opened Then no dialog is closed", () => {
            service.pop();

            expect(closeMock).not.toHaveBeenCalled();
        });
    });

});
