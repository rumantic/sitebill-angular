import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {FormComponent} from './form.component';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {ModelService} from '../../../_services/model.service';
import {FormBuilder} from '@angular/forms';
import {SnackService} from '../../../_services/snack.service';
import {FilterService} from '../../../_services/filter.service';
import {Bitrix24Service} from '../../../integrations/bitrix24/bitrix24.service';
import {APP_CONFIG} from '../../../app.config.module';
import {AppConfig} from '../../../app.config.module';
import {StorageService} from '../../../_services/storage.service';
import {SitebillEntity} from '../../../_models';


fdescribe('FormComponent', () => {

    let component: FormComponent;
    let fixture: ComponentFixture<FormComponent>;

    const fakeMatDialogRef = jasmine.createSpyObj('fakeMatDialogRef', ['close']);
    const fakeModelService = {...jasmine.createSpyObj('fakeModelService', ['get_access', 'get_user_id', 'get_api_url', 'get_app_name']), entity: new SitebillEntity()};
    const fakeFormBuilder = jasmine.createSpyObj('fakeFormBuilder', ['group']);
    const fakeSnackService = jasmine.createSpyObj('fakeSnackService', ['message']);
    const fakeMatDialog = jasmine.createSpyObj('fakeMatDialog', ['open']);
    const fakeFilterService = {};
    const fakeBitrix24Service = {};
    const fakeAppConfig = {};
    const fakeMatDialogData = jasmine.createSpyObj('fakeMatDialogData', ['set_readonly', 'is_delete_disabled', 'get_key_value', 'get_table_name']);
    const fakeStorageService = jasmine.createSpyObj('fakeStorageService', ['getItem']);

    beforeEach(async () => { // set_readonly
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
                { provide: APP_CONFIG, useValue: fakeAppConfig },
                { provide: MAT_DIALOG_DATA, useValue: fakeMatDialogData },
                { provide: StorageService, useValue: fakeStorageService },
            ]
        })
            .compileComponents();
    });
    beforeEach(() => {
        fixture = TestBed.createComponent(FormComponent);
        component = fixture.componentInstance;
        console.log(component);
        fixture.detectChanges();
    });

    fit('should create', () => {
        expect(component).toBeTruthy();
    });

});
