/**
 * Obtained from: https://blog.angularindepth.com/angular-unit-testing-performance-34363b7345ba
 */

import { ComponentFixture, getTestBed, TestBed } from "@angular/core/testing";

export const configureTestSuite = () => {
    const testBedApi: any = getTestBed();
    const originReset = TestBed.resetTestingModule;

    beforeAll(() => {
        TestBed.resetTestingModule();
        TestBed.resetTestingModule = () => TestBed;
    });

    afterEach(() => {
        testBedApi._activeFixtures.forEach((fixture: ComponentFixture<any>) => fixture.destroy());
        testBedApi._instantiated = false;
    });

    afterAll(() => {
        TestBed.resetTestingModule = originReset;
        TestBed.resetTestingModule();
    });
};
