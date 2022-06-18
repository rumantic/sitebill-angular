import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {FormComponent} from './form.component';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {ModelService} from '../../../_services/model.service';
import {FormBuilder} from "@angular/forms";
import {SnackService} from "../../../_services/snack.service";
import {FilterService} from "../../../_services/filter.service";
import {Bitrix24Service} from "../../../integrations/bitrix24/bitrix24.service";
import {AppConfig} from "../../../app.config.module";


fdescribe('FormComponent', () => {

    let component: FormComponent;
    let fixture: ComponentFixture<FormComponent>;

    const fakeMatDialogRef = jasmine.createSpyObj('fakeMatDialogRef', ['close']);
    const fakeModelService = jasmine.createSpyObj('fakeModelService', ['get_access', 'get_user_id']);
    const fakeFormBuilder = jasmine.createSpyObj('fakeFormBuilder', ['group']);
    const fakeSnackService = jasmine.createSpyObj('fakeSnackService', ['message']);
    const fakeMatDialog = jasmine.createSpyObj('fakeMatDialog', ['open']);
    const fakeFilterService = {};
    const fakeBitrix24Service = {};
    // const fakeAppConfig = {};

    beforeEach(async () => {
        TestBed.overrideComponent(FormComponent, {set: {providers: []}});
        await TestBed.configureTestingModule({
            declarations: [ FormComponent ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            providers: [
                { provide: MatDialogRef, useValue: fakeMatDialogRef },
                { provide: ModelService, useValue: fakeModelService },
                { provide: FormBuilder, useValue: fakeFormBuilder },
                { provide: SnackService, useValue: fakeSnackService },
                { provide: MatDialog, useValue: fakeMatDialog },
                { provide: FilterService, useValue: fakeFilterService },
                { provide: Bitrix24Service, useValue: fakeBitrix24Service },
                // { provide: InjectionToken app.config, useValue: fakeAppConfig },
            ]
        })
            .compileComponents();
    });
    beforeEach(() => {
        fixture = TestBed.createComponent(FormComponent);
        component = fixture.componentInstance;

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

});
