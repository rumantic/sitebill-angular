import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { FormConstructorComponent } from "./form-constructor.component";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ModelService } from "app/_services/model.service";
import { FormBuilder } from "@angular/forms";
import { SnackService } from "app/_services/snack.service";
import { FilterService } from "app/_services/filter.service";
import { Bitrix24Service } from "app/integrations/bitrix24/bitrix24.service";
import { MatDialog } from "@angular/material/dialog";
import { StorageService } from "app/_services/storage.service";
import { SitebillEntity } from "../../../_models";
import { TestDataFake } from "./test-data";
import { Observable, Observer } from "rxjs";

describe("FormConstructorComponent", () => {
    let component: FormConstructorComponent;
    let fixture: ComponentFixture<FormConstructorComponent>;
    const fakeData = new Observable((sub) => {
        sub.next(TestDataFake.data);
    });
    let val = "OOO";
    fakeData.subscribe((vl) => {
        this.val = vl;
    });

    const fakeModelService = {
        ...jasmine.createSpyObj("fakeModelService", [
            "get_access",
            "get_user_id",
            "get_api_url",
            "get_app_name",
            "loadById",
        ]),
        entity: new SitebillEntity(),
    };
    const xxx = fakeModelService.loadById.and.returnValue(val); // вернуть обзервйбл
    const fakeFormBuilder = jasmine.createSpyObj("fakeFormBuilder", ["group"]);
    const fakeSnackService = jasmine.createSpyObj("fakeSnackService", [
        "message",
    ]);
    const fakeMatDialog = jasmine.createSpyObj("fakeMatDialog", ["open"]);
    const fakeFilterService = {};
    const fakeBitrix24Service = jasmine.createSpyObj("fakeBitrix24Service", [
        "init_input_parameters",
        "is_bitrix24_inited",
    ]);

    const fakeStorageService = jasmine.createSpyObj("fakeStorageService", [
        "getItem",
    ]);

    beforeEach(async () => {
        //

        await TestBed.configureTestingModule({
            declarations: [FormConstructorComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            providers: [
                { provide: ModelService, useValue: fakeModelService },
                { provide: FormBuilder, useValue: fakeFormBuilder },
                { provide: SnackService, useValue: fakeSnackService },
                { provide: MatDialog, useValue: fakeMatDialog },
                { provide: FilterService, useValue: fakeFilterService },
                { provide: Bitrix24Service, useValue: fakeBitrix24Service },
                { provide: StorageService, useValue: fakeStorageService },
            ],
        }).compileComponents();
    });
    beforeEach(() => {
        fixture = TestBed.createComponent(FormConstructorComponent);
        component = fixture.componentInstance;

        let entity = new SitebillEntity();
        entity.set_table_name("data");
        entity.set_app_name("data");
        entity.set_primary_key("id");
        entity.set_title("Data test");
        component._data = entity;

        console.log(component);
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
